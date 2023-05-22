import { injectable, inject } from 'tsyringe';
import IOrderItemPhasesRepository from '@modules/order/repositories/IOrderItemPhasesRepository';
import { OrderItemsPhases } from '@prisma/client';

@injectable()
class ListOrderItemPhasesService {
  constructor(
    @inject('OrderItemPhasesRepository')
    private orderItemPhasesRepository: IOrderItemPhasesRepository,
  ) {}

  public async execute(
    orderItemsId: string,
  ): Promise<OrderItemsPhases[] | undefined> {
    const allOrderItemPhasesByidCustomer =
      await this.orderItemPhasesRepository.list(orderItemsId);

    return allOrderItemPhasesByidCustomer;
  }
}

export default ListOrderItemPhasesService;
