import { OrderItemPhasesModel } from '@models/OrderItemPhasesModel';

export interface ICreateOrderItemsDTO {
  orderId: string;
  productId: string;
  saleId: string;
  description: string;
  phases: OrderItemPhasesModel[];
}
