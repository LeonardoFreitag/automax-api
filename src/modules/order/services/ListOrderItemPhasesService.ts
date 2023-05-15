import { injectable, inject } from 'tsyringe';
import OrderItemPhases from '@modules/order/infra/typeorm/entities/OrderItemPhases';
import IOrderItemPhasesRepository from '@modules/order/repositories/IOrderItemPhasesRepository';

@injectable()
class ListOrderItemPhasesService {
  constructor(
    @inject('OrderItemPhasesRepository')
    private orderItemPhasesRepository: IOrderItemPhasesRepository,
  ) {}

  public async execute(
    orderItemId: string,
  ): Promise<OrderItemPhases[] | undefined> {
    const allOrderItemPhasesByidCustomer =
      await this.orderItemPhasesRepository.list(orderItemId);

    return allOrderItemPhasesByidCustomer;
  }
}

export default ListOrderItemPhasesService;
