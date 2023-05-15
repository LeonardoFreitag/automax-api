import OrderItemPhases from '@modules/order/infra/typeorm/entities/OrderItemPhases';
import { ICreateOrderItemPhasesDTO } from '../dtos/ICreateOrderItemPhasesDTO';

export default interface IOrderItemPhasesRepository {
  findById(id: string): Promise<OrderItemPhases | undefined>;
  create(data: ICreateOrderItemPhasesDTO): Promise<OrderItemPhases>;
  save(orderItemPhases: OrderItemPhases): Promise<OrderItemPhases>;
  list(orderItemId: string): Promise<OrderItemPhases[]>;
  delete(id: string): Promise<void>;
}
