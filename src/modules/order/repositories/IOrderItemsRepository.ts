import { OrderItems, Prisma } from '@prisma/client';

export default interface IOrderItemsItemsRepository {
  findById(id: string): Promise<OrderItems | undefined>;
  create(data: Prisma.OrderItemsUncheckedCreateInput): Promise<OrderItems>;
  save(orderItems: OrderItems): Promise<OrderItems>;
  list(orderId: string): Promise<OrderItems[]>;
  delete(id: string): Promise<void>;
}
