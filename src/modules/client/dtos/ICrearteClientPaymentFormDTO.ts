export interface ICreateClientPaymentFormDTO {
  clientId: string;
  paymentFormId: string;
  description: string;
  installmentsLimit: number;
}
