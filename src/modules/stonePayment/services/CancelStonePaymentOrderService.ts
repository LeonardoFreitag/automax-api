import { injectable, inject } from 'tsyringe';
import IStonePaymentRepository from '@modules/stonePayment/repositories/IStonePaymentRepository';
import { StonePaymentOrder } from '@prisma/client';
import { isFinalStatus } from '@modules/stonePayment/stonePaymentStatus';
import assertOrderBelongsToCustomer from '@modules/stonePayment/assertOrderBelongsToCustomer';

interface IResponse {
  stonePaymentOrder: StonePaymentOrder;
  /** false quando o pedido já estava em status final (o controller devolve 409). */
  canceled: boolean;
}

/**
 * Cancelamento pedido pelo PDV.
 *
 * - "pending": o app Android ainda não viu o pedido, então vira "canceled"
 *   direto e some da fila.
 * - "sent_to_terminal": o Deeplink já foi disparado. O cancelamento real só
 *   acontece na maquineta; aqui só marcamos cancelRequested para o app avisar
 *   o operador.
 * - status final: nada a fazer.
 */
@injectable()
class CancelStonePaymentOrderService {
  constructor(
    @inject('StonePaymentRepository')
    private stonePaymentRepository: IStonePaymentRepository,
  ) {}

  public async execute(id: string, customerId: string): Promise<IResponse> {
    const stonePaymentOrder = assertOrderBelongsToCustomer(
      await this.stonePaymentRepository.findById(id),
      customerId,
    );

    if (isFinalStatus(stonePaymentOrder.status)) {
      return { stonePaymentOrder, canceled: false };
    }

    if (stonePaymentOrder.status === 'pending') {
      const updated = await this.stonePaymentRepository.update(id, {
        status: 'canceled',
      });

      return { stonePaymentOrder: updated, canceled: true };
    }

    const updated = await this.stonePaymentRepository.update(id, {
      cancelRequested: true,
    });

    return { stonePaymentOrder: updated, canceled: true };
  }
}

export default CancelStonePaymentOrderService;
