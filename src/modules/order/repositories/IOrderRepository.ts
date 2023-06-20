import { Order, Prisma } from '@prisma/client';

export default interface IOrderRepository {
  findById(id: string): Promise<Order | undefined>;
  findByOrderNumber(orderNumber: string): Promise<Order | undefined>;
  findByCustomerIdAndTagId(
    customerId: string,
    tagId: string,
  ): Promise<Order | undefined>;
  create(data: Prisma.OrderUncheckedCreateInput): Promise<Order>;
  save(Oorder: Order): Promise<Order>;
  list(customerId: string): Promise<Order[]>;
  delete(id: string): Promise<void>;
}
