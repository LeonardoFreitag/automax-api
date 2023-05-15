import AppError from '@shared/errors/AppError';
import IOrderItemsRepository from '@modules/order/repositories/IOrderItemsRepository';
import { injectable, inject } from 'tsyringe';

import OrderItems from '@modules/order/infra/typeorm/entities/OrderItems';

@injectable()
class UpdateOrderItemsService {
  constructor(
    @inject('OrderItemsRepository')
    private orderItemsRepository: IOrderItemsRepository,
  ) {}

  public async execute(data: OrderItems): Promise<OrderItems> {
    const { id } = data;
    const orderItem = await this.orderItemsRepository.findById(id);

    if (!orderItem) {
      throw new AppError('OrderItems not found');
    }

    orderItem.productId = data.productId;
    orderItem.saleId = data.saleId;
    orderItem.description = data.description;

    return this.orderItemsRepository.save(orderItem);
  }
}

export default UpdateOrderItemsService;
