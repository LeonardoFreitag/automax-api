export interface SalePaymentFormModel {
  id?: string;
  saleId?: string;
  paymentFormId: string;
  descripriont: string;
  amount: number;
  installments: number;
}
