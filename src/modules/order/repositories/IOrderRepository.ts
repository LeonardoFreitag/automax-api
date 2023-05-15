import Order from '@modules/order/infra/typeorm/entities/Order';
import { ICreateOrderDTO } from '../dtos/ICreateOrderDTO';

export default interface IOrderRepository {
  findById(id: string): Promise<Order | undefined>;
  findByOrderNumber(orderNumber: string): Promise<Order | undefined>;
  create(data: ICreateOrderDTO): Promise<Order>;
  save(Oorder: Order): Promise<Order>;
  list(customerId: string): Promise<Order[]>;
  delete(id: string): Promise<void>;
}
