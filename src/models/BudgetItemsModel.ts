export interface BudgetItemsModel {
  id: string;
  productId: string;
  code: string;
  reference: string;
  description: string;
  unity: string;
  tableId: string;
  tableCode?: string | null;
  tableName?: string | null;
  price: number;
  quantity: number;
  amount: number;
  notes?: string | null;
  originalPrice: number;
  groupId: string;
  groupName?: string | null;
  tissueId: string;
  tissueCode: string;
  tissueName?: string | null;
  underMeasure: boolean;
  widthSale: number;
  createdAt: Date;
  updatedAt: Date;
  budgetId: string;
}
