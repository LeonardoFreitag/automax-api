import AppError from '@shared/errors/AppError';
import IOrderRepository from '@modules/order/repositories/IOrderRepository';
import { injectable, inject } from 'tsyringe';
import { Order } from '@prisma/client';

@injectable()
class FinalizeOrderService {
  constructor(
    @inject('OrderRepository')
    private orderRepository: IOrderRepository,
  ) {}

  public async execute(id: string, status: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    order.status = status;

    return this.orderRepository.save(order);
  }
}

export default FinalizeOrderService;
