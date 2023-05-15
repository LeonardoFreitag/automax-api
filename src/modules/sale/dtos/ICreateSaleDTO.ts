import { SaleItemsModel } from '@models/SaleItemsModel';
import { SalePaymentFormModel } from '@models/SalePaymentFormModel';

export interface ICreateSaleDTO {
  customerId: string;
  selerId: string;
  saleNumber: string;
  saleDate: Date;
  clientId: string;
  items: SaleItemsModel[];
  amount: number;
  discount: number;
  total: number;
  notes: string;
  finished: boolean;
  sent: boolean;
  refused: boolean;
  refusedNotes: string;
  returned: boolean;
  returnedNotes: string;
  paymentForm: SalePaymentFormModel[];
  signatureFileName?: string;
  signatureUrl?: string;
  signatureBase64?: string;
  accepted: boolean;
}
