import { OrderItemsPhases, Prisma } from '@prisma/client';

export default interface IOrderItemPhasesRepository {
  findById(id: string): Promise<OrderItemsPhases | undefined>;
  create(
    data: Prisma.OrderItemsPhasesUncheckedCreateInput,
  ): Promise<OrderItemsPhases>;
  save(orderItemsPhases: OrderItemsPhases): Promise<OrderItemsPhases>;
  list(orderItemsId: string): Promise<OrderItemsPhases[]>;
  delete(id: string): Promise<void>;
}
