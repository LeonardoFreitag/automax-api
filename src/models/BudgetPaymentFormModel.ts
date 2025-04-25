export interface BudgetPaymentFormModel {
  id: string;
  paymentFormId: string;
  description: string;
  amount: number;
  installments: number;
  createdAt: Date;
  updatedAt: Date;
  budgetId: string;
}
