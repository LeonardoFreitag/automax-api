import { injectable, inject } from 'tsyringe';
import Order from '@modules/order/infra/typeorm/entities/Order';
import IOrderRepository from '@modules/order/repositories/IOrderRepository';

@injectable()
class ListOrderService {
  constructor(
    @inject('OrderRepository')
    private orderRepository: IOrderRepository,
  ) {}

  public async execute(customerId: string): Promise<Order[] | undefined> {
    const allOrderByidCustomer = await this.orderRepository.list(customerId);

    return allOrderByidCustomer;
  }
}

export default ListOrderService;
