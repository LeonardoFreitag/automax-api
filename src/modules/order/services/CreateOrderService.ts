import { injectable, inject } from 'tsyringe';
import IOrderRepository from '@modules/order/repositories/IOrderRepository';
import { Order, Prisma } from '@prisma/client';
import AppError from '@shared/errors/AppError';

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrderRepository')
    private orderRepository: IOrderRepository,
  ) {}

  public async execute({
    customerId,
    orderId,
    orderDate,
    orderNumber,
    description,
    notes,
    status,
    tagId,
    tagProductId,
    tagReference,
    tagProductName,
    tagTissueName,
    tagSellerName,
    tagStatus,
  }: Prisma.OrderUncheckedCreateInput): Promise<Order> {
    const checkOrderExists =
      await this.orderRepository.findByCustomerIdAndTagId(customerId, tagId);

    if (checkOrderExists) {
      throw new AppError('Order already exists!');
    }

    const order = await this.orderRepository.create({
      customerId,
      orderId,
      orderDate,
      orderNumber,
      description,
      notes,
      status,
      tagId,
      tagProductId,
      tagReference,
      tagProductName,
      tagTissueName,
      tagSellerName,
      tagStatus,
    });

    return order;
  }
}

export default CreateOrderService;
