import { injectable, inject } from 'tsyringe';
import IOrderItemsRepository from '@modules/order/repositories/IOrderItemsRepository';
import { OrderItems } from '@prisma/client';

@injectable()
class ListOrderItemsService {
  constructor(
    @inject('OrderItemsRepository')
    private orderItemsRepository: IOrderItemsRepository,
  ) {}

  public async execute(customerId: string): Promise<OrderItems[] | undefined> {
    const allOrderItemsByidCustomer = await this.orderItemsRepository.list(
      customerId,
    );

    return allOrderItemsByidCustomer;
  }
}

export default ListOrderItemsService;
