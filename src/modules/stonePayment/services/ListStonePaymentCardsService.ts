import { injectable, inject } from 'tsyringe';
import IStonePaymentRepository from '@modules/stonePayment/repositories/IStonePaymentRepository';
import { StonePaymentOrder } from '@prisma/client';

/**
 * Lista de cards de cobrança (delivery) consumida pelo app da SmartPOS
 * (refetch ~10s enquanto a tela "Cobranças" está aberta).
 *
 * Por customer, sem filtro de terminal: se uma maquininha quebrar, o
 * entregador pega outra e a lista está lá. Nada aqui dispara sozinho — o app
 * só cobra no toque, com claim atômico (ver UpdateStonePaymentOrderService).
 *
 * Expiração preguiçosa antes de montar a lista, como na fila attended.
 */
@injectable()
class ListStonePaymentCardsService {
  constructor(
    @inject('StonePaymentRepository')
    private stonePaymentRepository: IStonePaymentRepository,
  ) {}

  public async execute(customerId: string): Promise<StonePaymentOrder[]> {
    const expired =
      await this.stonePaymentRepository.listExpiredPendingCardsByCustomer(
        customerId,
      );

    if (expired.length > 0) {
      await this.stonePaymentRepository.expireMany(
        expired.map(card => card.id),
      );
    }

    return this.stonePaymentRepository.listCardsByCustomer(customerId);
  }
}

export default ListStonePaymentCardsService;
