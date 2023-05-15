import OrderItems from '@modules/order/infra/typeorm/entities/OrderItems';
import { ICreateOrderItemsDTO } from '../dtos/ICreateOrderItemsDTO';

export default interface IOrderItemsItemsRepository {
  findById(id: string): Promise<OrderItems | undefined>;
  create(data: ICreateOrderItemsDTO): Promise<OrderItems>;
  save(orderItems: OrderItems): Promise<OrderItems>;
  list(orderId: string): Promise<OrderItems[]>;
  delete(id: string): Promise<void>;
}
