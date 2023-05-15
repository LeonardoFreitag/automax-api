import { injectable, inject } from 'tsyringe';
import IOrderRepository from '@modules/order/repositories/IOrderRepository';
import Order from '@modules/order/infra/typeorm/entities/Order';
import { ICreateOrderDTO } from '@modules/order/dtos/ICreateOrderDTO';

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
    items,
    finished,
    canceled,
  }: ICreateOrderDTO): Promise<Order> {
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
      items,
      finished,
      canceled,
    });

    return order;
  }
}

export default CreateOrderService;
