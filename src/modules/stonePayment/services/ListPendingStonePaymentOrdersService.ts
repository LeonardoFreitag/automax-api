import { injectable, inject } from 'tsyringe';
import IStonePaymentRepository from '@modules/stonePayment/repositories/IStonePaymentRepository';
import { StonePaymentOrder } from '@prisma/client';

/**
 * Fila consumida pelo app Android da SmartPOS (polling ~2s).
 *
 * Antes de montar a lista, marca como "expired" os pendentes vencidos daquele
 * terminal — mesma expiração preguiçosa do GET por id, só que em lote.
 */
@injectable()
class ListPendingStonePaymentOrdersService {
  constructor(
    @inject('StonePaymentRepository')
    private stonePaymentRepository: IStonePaymentRepository,
  ) {}

  public async execute(
    customerId: string,
    terminalId: string,
  ): Promise<StonePaymentOrder[]> {
    const expired =
      await this.stonePaymentRepository.listExpiredPendingByTerminal(
        customerId,
        terminalId,
      );

    if (expired.length > 0) {
      await this.stonePaymentRepository.expireMany(
        expired.map(item => item.id),
      );
    }

    return this.stonePaymentRepository.listPendingByTerminal(
      customerId,
      terminalId,
    );
  }
}

export default ListPendingStonePaymentOrdersService;
