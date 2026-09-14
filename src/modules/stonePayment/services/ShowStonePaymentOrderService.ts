import { injectable, inject } from 'tsyringe';
import IStonePaymentRepository from '@modules/stonePayment/repositories/IStonePaymentRepository';
import { StonePaymentOrder } from '@prisma/client';
import assertOrderBelongsToCustomer from '@modules/stonePayment/assertOrderBelongsToCustomer';

/**
 * Consulta do PDV (polling ~2,5s).
 *
 * Faz a expiração preguiçosa: se o pedido continua "pending" e a validade já
 * passou, ele vira "expired" antes de responder. Isso dispensa job de
 * varredura — quem lê é quem expira.
 */
@injectable()
class ShowStonePaymentOrderService {
  constructor(
    @inject('StonePaymentRepository')
    private stonePaymentRepository: IStonePaymentRepository,
  ) {}

  public async execute(
    id: string,
    customerId: string,
  ): Promise<StonePaymentOrder> {
    const stonePaymentOrder = assertOrderBelongsToCustomer(
      await this.stonePaymentRepository.findById(id),
      customerId,
    );

    if (
      stonePaymentOrder.status === 'pending' &&
      stonePaymentOrder.expiresAt.getTime() <= Date.now()
    ) {
      // Se retornar zero, o app respondeu entre a leitura e a escrita; de
      // qualquer forma a releitura devolve o estado real gravado no banco.
      await this.stonePaymentRepository.expireMany([stonePaymentOrder.id]);

      return this.stonePaymentRepository.findById(id);
    }

    return stonePaymentOrder;
  }
}

export default ShowStonePaymentOrderService;
