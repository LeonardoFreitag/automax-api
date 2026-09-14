import { injectable, inject } from 'tsyringe';
import IStonePaymentRepository from '@modules/stonePayment/repositories/IStonePaymentRepository';
import { StonePaymentOrder } from '@prisma/client';
import AppError from '@shared/errors/AppError';

interface IRequest {
  id: string;
  /** Vem do token do PDV, não do corpo. */
  customerId: string;
  /** Código da venda que está fechando com este pagamento. */
  consumedBySale: string;
}

/**
 * Fechamento da venda com um card de cobrança pago (delivery).
 *
 * Um card aprovado só pode fechar UMA venda. O consumo é compare-and-set no
 * banco (`consumed = false`), então dois caixas retomando a mesma venda ao
 * mesmo tempo não conseguem usar o mesmo pagamento duas vezes.
 *
 * Idempotente pela venda: repetir com o MESMO `consumedBySale` devolve 200 (o
 * PDV pode reenviar depois de uma queda de rede); com OUTRA venda é 422.
 *
 * Toda recusa é 422 com mensagem em português — inclusive "não encontrado",
 * porque para o PDV a distinção que importa é "corpo inválido" (400) contra
 * "esta cobrança não serve para fechar esta venda" (422).
 */
@injectable()
class ConsumeStonePaymentOrderService {
  constructor(
    @inject('StonePaymentRepository')
    private stonePaymentRepository: IStonePaymentRepository,
  ) {}

  public async execute({
    id,
    customerId,
    consumedBySale,
  }: IRequest): Promise<StonePaymentOrder> {
    const sale = consumedBySale?.trim();

    if (!sale) {
      throw new AppError('consumedBySale é obrigatório.', 422);
    }

    const order = await this.stonePaymentRepository.findById(id);

    if (!order || !customerId || order.customerId !== customerId) {
      throw new AppError('Cobrança não encontrada.', 422);
    }

    if (order.operation !== 'payment') {
      throw new AppError(
        'Só um pagamento pode ser usado para fechar uma venda (este pedido é um estorno).',
        422,
      );
    }

    if (order.consumed) {
      return this.assertSameSale(order, sale);
    }

    if (order.status !== 'approved') {
      throw new AppError(
        `A cobrança ainda não foi aprovada (status atual: ${order.status}).`,
        422,
      );
    }

    const consumed = await this.stonePaymentRepository.consume(id, sale);

    // Perdeu a corrida para outro caixa: o registro atual diz quem levou.
    if (!consumed) {
      const current = await this.stonePaymentRepository.findById(id);

      return this.assertSameSale(current, sale);
    }

    return this.stonePaymentRepository.findById(id);
  }

  private assertSameSale(
    order: StonePaymentOrder,
    sale: string,
  ): StonePaymentOrder {
    if (order.consumed && order.consumedBySale === sale) {
      return order;
    }

    throw new AppError(
      `Cobrança já utilizada na venda ${order.consumedBySale ?? '?'}.`,
      422,
    );
  }
}

export default ConsumeStonePaymentOrderService;
