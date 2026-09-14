import { injectable, inject } from 'tsyringe';
import IStonePaymentRepository from '@modules/stonePayment/repositories/IStonePaymentRepository';
import { Prisma, StonePaymentOrder } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import {
  STONE_INSTALLMENT_TYPES,
  STONE_PAYMENT_STATUSES,
  STONE_TRANSACTION_TYPES,
  isFinalStatus,
} from '@modules/stonePayment/stonePaymentStatus';
import assertOrderBelongsToCustomer from '@modules/stonePayment/assertOrderBelongsToCustomer';

interface IRequest {
  id: string;
  /** Vem do token do app Android, não do corpo. */
  customerId: string;
  status: string;
  authorizationCode?: string;
  brand?: string;
  atk?: string;
  itk?: string;
  panMasked?: string;
  entryMode?: string;
  cardholderName?: string;
  /**
   * O que foi DE FATO cobrado. Num card de delivery o tipo/parcelas do POST
   * são pré-seleção e o entregador pode trocar na hora — a API grava o
   * cobrado por cima.
   */
  transactionType?: string;
  installmentType?: string;
  installmentCount?: number;
  rawResponse?: Prisma.InputJsonValue;
  /**
   * Campos que a maquininha devolveu e que ainda não têm coluna própria. Não
   * são recusados: viram parte do `rawResponse` (ver `mergeRawResponse`).
   */
  extraFields?: Record<string, unknown>;
}

interface IResponse {
  stonePaymentOrder: StonePaymentOrder;
  /**
   * true quando o claim de um card falhou: outra maquininha já o tirou de
   * "pending". O controller devolve 409 com o pedido atual.
   */
  claimConflict: boolean;
}

/**
 * Junta o `rawResponse` enviado com os campos que não têm coluna.
 *
 * O retorno do Deeplink varia por modalidade e o de Pix não está documentado —
 * pode vir com `end_to_end_id` e sem `authorization_code`, por exemplo. Nada
 * disso pode derrubar o PATCH: o pagamento já aconteceu na maquineta, e perder
 * a resposta deixaria o pedido preso em "sent_to_terminal" enquanto o cliente
 * já pagou. Então o desconhecido é preservado em vez de recusado.
 *
 * Quando não há campo extra, o `rawResponse` é gravado exatamente como veio
 * (string crua da URI ou objeto). Só quando há extras é que ele vira objeto,
 * com o original preservado em `rawResponse` e os campos novos em
 * `extraFields`.
 */
function mergeRawResponse(
  rawResponse: Prisma.InputJsonValue | undefined,
  extraFields: Record<string, unknown> | undefined,
): Prisma.InputJsonValue | undefined {
  const hasExtras = extraFields && Object.keys(extraFields).length > 0;

  if (!hasExtras) {
    return rawResponse;
  }

  if (rawResponse === undefined) {
    return { extraFields } as Prisma.InputJsonValue;
  }

  if (
    typeof rawResponse === 'object' &&
    rawResponse !== null &&
    !Array.isArray(rawResponse)
  ) {
    return { ...rawResponse, extraFields } as Prisma.InputJsonValue;
  }

  return { rawResponse, extraFields } as Prisma.InputJsonValue;
}

/**
 * Atualização vinda do app Android: "sent_to_terminal" ao disparar o Deeplink
 * e depois o resultado final.
 *
 * Idempotente de propósito: se o pedido já está em status final, devolve o
 * registro como está, sem gravar nada. O app reenvia o mesmo resultado depois
 * de uma queda de rede e não pode sobrescrever um "approved" já registrado
 * (nem ressuscitar um "expired"/"canceled" que o PDV já leu e tratou).
 *
 * Card de delivery (mode = detached): o "sent_to_terminal" é um claim. Duas
 * maquininhas podem tocar o mesmo card ao mesmo tempo, então a transição
 * pending → sent_to_terminal é compare-and-set no banco; quem perde recebe
 * 409 com o pedido atual e o app mostra "sendo cobrado em outra maquineta".
 */
@injectable()
class UpdateStonePaymentOrderService {
  constructor(
    @inject('StonePaymentRepository')
    private stonePaymentRepository: IStonePaymentRepository,
  ) {}

  public async execute({
    id,
    customerId,
    status,
    extraFields,
    ...result
  }: IRequest): Promise<IResponse> {
    if (!STONE_PAYMENT_STATUSES.includes(status as never)) {
      throw new AppError(
        `status inválido. Valores aceitos: ${STONE_PAYMENT_STATUSES.join(
          ', ',
        )}`,
      );
    }

    if (
      result.transactionType !== undefined &&
      !STONE_TRANSACTION_TYPES.includes(result.transactionType as never)
    ) {
      throw new AppError(
        `transactionType inválido. Valores aceitos: ${STONE_TRANSACTION_TYPES.join(
          ', ',
        )}`,
      );
    }

    if (
      result.installmentType !== undefined &&
      !STONE_INSTALLMENT_TYPES.includes(result.installmentType as never)
    ) {
      throw new AppError(
        `installmentType inválido. Valores aceitos: ${STONE_INSTALLMENT_TYPES.join(
          ', ',
        )}`,
      );
    }

    const stonePaymentOrder = assertOrderBelongsToCustomer(
      await this.stonePaymentRepository.findById(id),
      customerId,
    );

    // Claim atômico do card: só uma maquininha sai de "pending".
    if (
      stonePaymentOrder.mode === 'detached' &&
      status === 'sent_to_terminal'
    ) {
      const claimed = await this.stonePaymentRepository.transitionStatus(
        id,
        'pending',
        'sent_to_terminal',
      );

      const current = await this.stonePaymentRepository.findById(id);

      return { stonePaymentOrder: current, claimConflict: !claimed };
    }

    if (isFinalStatus(stonePaymentOrder.status)) {
      return { stonePaymentOrder, claimConflict: false };
    }

    // Só grava o que veio no corpo: um PATCH de "sent_to_terminal" não pode
    // apagar campos de resultado, e o app manda os campos aos poucos.
    const data: Prisma.StonePaymentOrderUncheckedUpdateInput = { status };

    Object.entries({
      ...result,
      rawResponse: mergeRawResponse(result.rawResponse, extraFields),
    }).forEach(([field, value]) => {
      if (value !== undefined) {
        data[field] = value;
      }
    });

    const updated = await this.stonePaymentRepository.update(id, data);

    // Estorno aprovado: marca o pagamento original como estornado. É
    // auditoria (o PDV não depende disso), mas também é o que impede um
    // segundo estorno do mesmo pagamento no POST.
    if (
      updated.operation === 'cancellation' &&
      updated.status === 'approved' &&
      updated.targetPaymentId
    ) {
      await this.stonePaymentRepository.update(updated.targetPaymentId, {
        refundedByOrderId: updated.id,
      });
    }

    return { stonePaymentOrder: updated, claimConflict: false };
  }
}

export default UpdateStonePaymentOrderService;
