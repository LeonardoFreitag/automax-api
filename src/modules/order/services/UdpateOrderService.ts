import AppError from '@shared/errors/AppError';
import IOrderRepository from '@modules/order/repositories/IOrderRepository';
import { injectable, inject } from 'tsyringe';
import { Order } from '@prisma/client';

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
      throw new AppError('Order not found', 404);
    }

    order.orderDate = data.orderDate;
    order.orderNumber = data.orderNumber;
    order.description = data.description;
    order.notes = data.notes;
    order.status = data.status;
    order.tagId = data.tagId;
    order.tagProductId = data.tagProductId;
    order.tagReference = data.tagReference;
    order.tagProductName = data.tagProductName;
    order.tagTissueName = data.tagTissueName;
    order.tagSellerName = data.tagSellerName;
    order.tagStatus = data.tagStatus;

    return this.orderRepository.save(order);
  }
}

export default UpdateOrderService;
