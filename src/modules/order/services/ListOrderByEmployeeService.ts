import { injectable, inject } from 'tsyringe';
import IOrderRepository from '@modules/order/repositories/IOrderRepository';
import { Order } from '@prisma/client';

@injectable()
class ListOrderByEmployeeService {
  constructor(
    @inject('OrderRepository')
    private orderRepository: IOrderRepository,
  ) {}

  public async execute(
    customerId: string,
    employeeId: string,
  ): Promise<Order[]> {
    const orderList = await this.orderRepository.listByEmployeeId(
      customerId,
      employeeId,
    );

    return orderList;
  }
}

export default ListOrderByEmployeeService;
