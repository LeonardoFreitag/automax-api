import { Order, OrderItemsPhases, Prisma } from '@prisma/client';

export default interface IOrderItemsPhasesRepository {
  findByOrderIdAndPhaseId(
    orderId: string,
    phaseId: string,
  ): Promise<OrderItemsPhases | undefined>;
  findById(id: string): Promise<OrderItemsPhases | undefined>;
  create(
    data: Prisma.OrderItemsPhasesUncheckedCreateInput,
  ): Promise<OrderItemsPhases>;
  save(orderItemsPhases: OrderItemsPhases): Promise<OrderItemsPhases>;
  list(orderId: string): Promise<OrderItemsPhases[]>;
  listToday(dateCapture: string): Promise<OrderItemsPhases[]>;
  listAllCaptureToday(dateCapture: string): Promise<Order[]>;
  listAllCaptureTodayByIdCustomer(
    dateCapture: string,
    customerId: string,
  ): Promise<Order[]>;
  delete(id: string): Promise<void>;
}
