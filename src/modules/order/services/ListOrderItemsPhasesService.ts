import { injectable, inject } from 'tsyringe';
import IOrderItemsPhasesRepository from '@modules/order/repositories/IOrderItemsPhasesRepository';
import { OrderItemsPhases } from '@prisma/client';

@injectable()
class ListOrderItemsPhasesService {
  constructor(
    @inject('OrderItemsPhasesRepository')
    private orderItemsPhasesRepository: IOrderItemsPhasesRepository,
  ) {}

  public async execute(
    orderId: string,
  ): Promise<OrderItemsPhases[] | undefined> {
    const allOrderItemsPhasesByidCustomer =
      await this.orderItemsPhasesRepository.list(orderId);

    return allOrderItemsPhasesByidCustomer;
  }
}

export default ListOrderItemsPhasesService;
