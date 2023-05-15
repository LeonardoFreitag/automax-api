import { OrderItemsModel } from './OrderItemsModel';

export interface OrderModel {
  id: string;
  customerId: string;
  orderNumber: string;
  userId: string;
  orderDate: Date;
  description: string;
  notes: string;
  items: OrderItemsModel[];
  finished: boolean;
  canceled: boolean;
}
