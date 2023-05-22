import { injectable, inject } from 'tsyringe';
import IOrderItemsRepository from '@modules/order/repositories/IOrderItemsRepository';
import { OrderItems, Prisma } from '@prisma/client';

@injectable()
class CreateOrderItemsService {
  constructor(
    @inject('OrderItemsRepository')
    private orderItemsRepository: IOrderItemsRepository,
  ) {}

  public async execute({
    orderId,
    productId,
    saleId,
    description,
    OrderItemsPhases,
  }: Prisma.OrderItemsUncheckedCreateInput): Promise<OrderItems> {
    const orderItems = await this.orderItemsRepository.create({
      orderId,
      productId,
      saleId,
      description,
      OrderItemsPhases,
    });

    return orderItems;
  }
}

export default CreateOrderItemsService;
