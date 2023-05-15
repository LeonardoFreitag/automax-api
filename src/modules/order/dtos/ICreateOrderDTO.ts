import { OrderItemsModel } from '@models/OrderItemsModel';

export interface ICreateOrderDTO {
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
