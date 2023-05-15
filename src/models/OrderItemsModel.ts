import { OrderItemPhasesModel } from './OrderItemPhasesModel';

export interface OrderItemsModel {
  id?: string;
  orderId?: string;
  productId: string;
  saleId: string;
  description: string;
  phases: OrderItemPhasesModel[];
}
