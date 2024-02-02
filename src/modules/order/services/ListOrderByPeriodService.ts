import { injectable, inject } from 'tsyringe';
import IOrderRepository from '@modules/order/repositories/IOrderRepository';
import { Order } from '@prisma/client';

@injectable()
class ListOrderByPeriodService {
  constructor(
    @inject('OrderRepository')
    private orderRepository: IOrderRepository,
  ) {}

  public async execute(
    customerId: string,
    initialDate: string,
    finalDate: string,
  ): Promise<Order[]> {
    const orderList = await this.orderRepository.listByPeriodo(
      customerId,
      initialDate,
      finalDate,
    );

    return orderList;
  }
}

export default ListOrderByPeriodService;
