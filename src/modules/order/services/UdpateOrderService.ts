import AppError from '@shared/errors/AppError';
import IOrderRepository from '@modules/order/repositories/IOrderRepository';
import { injectable, inject } from 'tsyringe';

import Order from '@modules/order/infra/typeorm/entities/Order';

@injectable()
class UpdateOrderService {
  constructor(
    @inject('OrderRepository')
    private orderRepository: IOrderRepository,
  ) {}

  public async execute(data: Order): Promise<Order> {
    const { id } = data;
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new AppError('Order not found');
    }

    order.orderNumber = data.orderNumber;
    order.userId = data.userId;
    order.orderDate = data.orderDate;
    order.description = data.description;
    order.notes = data.notes;
    order.finished = data.finished;
    order.canceled = data.canceled;

    return this.orderRepository.save(order);
  }
}

export default UpdateOrderService;
