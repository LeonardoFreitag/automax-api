export interface SaleItemsModel {
  id?: string;
  saleId?: string;
  productId: string;
  code: string;
  reference: string;
  description: string;
  unity: string;
  tableId: string;
  price: number;
  quantity: number;
  amount: number;
  notes: string;
}
