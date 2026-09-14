import { injectable, inject } from 'tsyringe';
import IStonePaymentRepository from '@modules/stonePayment/repositories/IStonePaymentRepository';
import { Prisma, StonePaymentOrder } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import {
  DEFAULT_EXPIRES_IN_MINUTES,
  MAX_CARD_DESCRIPTION_LENGTH,
  MAX_DETACHED_EXPIRES_IN_MINUTES,
  MAX_EXPIRES_IN_MINUTES,
  STONE_INSTALLMENT_TYPES,
  STONE_MODES,
  STONE_OPERATIONS,
  STONE_TRANSACTION_TYPES,
} from '@modules/stonePayment/stonePaymentStatus';

/** Campos que dependem da operação (pagamento x estorno). */
type IOperationFields = Pick<
  Prisma.StonePaymentOrderUncheckedCreateInput,
  'transactionType'
> &
  Partial<
    Pick<
      Prisma.StonePaymentOrderUncheckedCreateInput,
      'installmentType' | 'installmentCount' | 'targetPaymentId' | 'targetAtk'
    >
  >;

interface IRequest {
  /** Sempre o customer do token; o do corpo é só conferido contra este. */
  customerId: string;
  /** O que o PDV mandou no corpo, quando mandou. */
  bodyCustomerId?: string;
  terminalId: string;
  externalRef: string;
  amountCents: number;
  /** payment (default) | cancellation */
  operation?: string;
  /** attended (default) | detached (card de cobrança / delivery) */
  mode?: string;
  /** Card: texto que o entregador vê na lista. Obrigatório no detached. */
  description?: string;
  /** Estorno: uuid do pagamento aprovado a estornar. */
  targetPaymentId?: string;
  transactionType?: string;
  installmentType?: string;
  installmentCount?: number;
  expiresInMinutes?: number;
}

/**
 * Cria um pedido na fila da SmartPOS.
 *
 * Duas operações compartilham a fila e o fluxo de status:
 *
 * - **payment**: o PDV pede uma cobrança; o app dispara o Deeplink de
 *   pagamento da Stone.
 * - **cancellation** (estorno): o PDV aponta um pagamento já aprovado; a API
 *   resolve o `atk` dele e o app dispara o Deeplink de cancelamento com esse
 *   atk. Falha de regra de negócio aqui é 422 (o corpo está bem formado, o
 *   alvo é que não serve) — o PDV distingue de 400 (corpo inválido).
 *
 * E dois modos para o pagamento:
 *
 * - **attended** (balcão): entra na fila do `terminalId` e o app dispara
 *   sozinho.
 * - **detached** (card de cobrança / delivery): não entra na fila; aparece na
 *   lista de cards de TODAS as maquininhas do customer e só cobra no toque do
 *   entregador. `terminalId` fica só como auditoria de origem. O tipo e as
 *   parcelas são pré-seleção — o app manda no desfecho o que foi de fato
 *   cobrado.
 */
@injectable()
class CreateStonePaymentOrderService {
  constructor(
    @inject('StonePaymentRepository')
    private stonePaymentRepository: IStonePaymentRepository,
  ) {}

  public async execute(request: IRequest): Promise<StonePaymentOrder> {
    const { customerId, bodyCustomerId, expiresInMinutes } = request;
    const operation = request.operation ?? 'payment';
    const mode = request.mode ?? 'attended';

    if (!customerId) {
      throw new AppError('Token sem customer associado.', 403);
    }

    // O PDV pode continuar mandando customerId no corpo (compatibilidade),
    // mas ele só serve de conferência: quem manda é o token. Divergência
    // significa aparelho configurado com o cliente errado.
    if (bodyCustomerId && bodyCustomerId !== customerId) {
      throw new AppError(
        'O customerId enviado não corresponde ao customer do token.',
        403,
      );
    }

    if (!STONE_OPERATIONS.includes(operation as never)) {
      throw new AppError(
        `operation inválida. Valores aceitos: ${STONE_OPERATIONS.join(', ')}`,
      );
    }

    if (!STONE_MODES.includes(mode as never)) {
      throw new AppError(
        `mode inválido. Valores aceitos: ${STONE_MODES.join(', ')}`,
      );
    }

    const detached = mode === 'detached';

    // Estorno é sempre imediato, pela maquininha que está com o operador —
    // não existe "card de estorno" para o entregador tocar.
    if (detached && operation !== 'payment') {
      throw new AppError(
        'Card de cobrança (mode = detached) só existe para operation = payment.',
        422,
      );
    }

    const description = request.description?.trim();

    if (detached) {
      if (!description) {
        throw new AppError(
          'description é obrigatória no card de cobrança (mode = detached).',
          422,
        );
      }

      if (description.length > MAX_CARD_DESCRIPTION_LENGTH) {
        throw new AppError(
          `description deve ter no máximo ${MAX_CARD_DESCRIPTION_LENGTH} caracteres.`,
          422,
        );
      }
    }

    // As mesmas validações já estão no celebrate da rota. Repetidas aqui
    // porque o serviço é o dono da regra: qualquer chamada futura (job,
    // outro controller) precisa cair nas mesmas restrições.
    if (!Number.isInteger(request.amountCents) || request.amountCents <= 0) {
      throw new AppError('amountCents deve ser um inteiro maior que zero');
    }

    // Balcão espera minutos; um card de delivery pode esperar a rota inteira.
    // 422 (e não 400 do celebrate) porque o teto depende do mode.
    const minutes = expiresInMinutes ?? DEFAULT_EXPIRES_IN_MINUTES;
    const maxMinutes = detached
      ? MAX_DETACHED_EXPIRES_IN_MINUTES
      : MAX_EXPIRES_IN_MINUTES;

    if (!Number.isInteger(minutes) || minutes < 1 || minutes > maxMinutes) {
      throw new AppError(
        `expiresInMinutes deve estar entre 1 e ${maxMinutes} para mode = ${mode}.`,
        422,
      );
    }

    const expiresAt = new Date(Date.now() + minutes * 60 * 1000);

    const specific =
      operation === 'cancellation'
        ? await this.buildCancellation(request)
        : this.buildPayment(request);

    const stonePaymentOrder = await this.stonePaymentRepository.create({
      customerId,
      terminalId: request.terminalId,
      externalRef: request.externalRef,
      amountCents: request.amountCents,
      operation,
      status: 'pending',
      cancelRequested: false,
      mode,
      description: detached ? description : request.description ?? null,
      consumed: false,
      expiresAt,
      ...specific,
    });

    return stonePaymentOrder;
  }

  private buildPayment({
    transactionType,
    installmentType,
    installmentCount,
  }: IRequest): IOperationFields {
    if (!STONE_TRANSACTION_TYPES.includes(transactionType as never)) {
      throw new AppError(
        `transactionType inválido. Valores aceitos: ${STONE_TRANSACTION_TYPES.join(
          ', ',
        )}`,
      );
    }

    if (
      installmentType &&
      !STONE_INSTALLMENT_TYPES.includes(installmentType as never)
    ) {
      throw new AppError(
        `installmentType inválido. Valores aceitos: ${STONE_INSTALLMENT_TYPES.join(
          ', ',
        )}`,
      );
    }

    const parcelado =
      installmentType === 'MERCHANT' || installmentType === 'ISSUER';

    if (installmentCount !== undefined && installmentCount !== null) {
      if (!parcelado) {
        throw new AppError(
          'installmentCount só é aceito com installmentType MERCHANT ou ISSUER',
        );
      }

      if (
        !Number.isInteger(installmentCount) ||
        installmentCount < 2 ||
        installmentCount > 12
      ) {
        throw new AppError('installmentCount deve estar entre 2 e 12');
      }
    }

    return {
      transactionType,
      installmentType: installmentType ?? null,
      installmentCount: installmentCount ?? null,
    };
  }

  /**
   * Estorno total (v1): o PDV manda o valor cheio do lançamento e o uuid do
   * pagamento aprovado. transactionType/installment* do corpo são ignorados —
   * o que vale é o do pagamento alvo, copiado para o registro do estorno só
   * como informação.
   */
  private async buildCancellation({
    customerId,
    targetPaymentId,
    amountCents,
  }: IRequest): Promise<IOperationFields> {
    if (!targetPaymentId) {
      throw new AppError(
        'targetPaymentId é obrigatório para operation = cancellation',
        422,
      );
    }

    const target = await this.stonePaymentRepository.findById(targetPaymentId);

    // Alvo de outro customer conta como inexistente: não confirmamos nem que
    // o id existe.
    if (!target || target.customerId !== customerId) {
      throw new AppError('Pagamento a estornar não encontrado.', 422);
    }

    if (target.operation !== 'payment') {
      throw new AppError(
        'O pedido informado em targetPaymentId não é um pagamento.',
        422,
      );
    }

    if (target.status !== 'approved') {
      throw new AppError(
        `Só é possível estornar um pagamento aprovado (status atual: ${target.status}).`,
        422,
      );
    }

    if (!target.atk) {
      throw new AppError(
        'Pagamento aprovado sem atk gravado — não é possível estornar pela maquininha.',
        422,
      );
    }

    if (target.refundedByOrderId) {
      throw new AppError('Este pagamento já foi estornado.', 422);
    }

    if (amountCents > target.amountCents) {
      throw new AppError(
        `amountCents (${amountCents}) maior que o valor do pagamento (${target.amountCents}).`,
        422,
      );
    }

    const active =
      await this.stonePaymentRepository.findActiveCancellationByTarget(
        target.id,
      );

    if (active) {
      throw new AppError(
        `Já existe um estorno ${
          active.status === 'approved' ? 'aprovado' : 'em andamento'
        } para este pagamento (${active.id}).`,
        422,
      );
    }

    return {
      targetPaymentId: target.id,
      targetAtk: target.atk,
      transactionType: target.transactionType,
      installmentType: target.installmentType,
      installmentCount: target.installmentCount,
    };
  }
}

export default CreateStonePaymentOrderService;
