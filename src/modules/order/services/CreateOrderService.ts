import { injectable, inject } from 'tsyringe';
import IOrderRepository from '@modules/order/repositories/IOrderRepository';
import { Order, Prisma } from '@prisma/client';

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrderRepository')
    private orderRepository: IOrderRepository,
  ) {}

  public async execute({
    customerId,
    orderNumber,
    userId,
    orderDate,
    description,
    notes,
    finished,
    canceled,
    OrderItems,
  }: Prisma.OrderUncheckedCreateInput): Promise<Order> {
    const checkOrderExists = await this.orderRepository.findByOrderNumber(
      orderNumber,
    );

    if (checkOrderExists) {
      this.orderRepository.delete(checkOrderExists.id);
    }

    const order = await this.orderRepository.create({
      customerId,
      orderNumber,
      userId,
      orderDate,
      description,
      notes,
      finished,
      canceled,
      OrderItems,
    });

    return order;
  }
}

export default CreateOrderService;
