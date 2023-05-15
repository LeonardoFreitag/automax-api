import { SalePaymentFormModel } from './SalePaymentFormModel';
import { SaleItemsModel } from './SaleItemsModel';

export interface SaleModel {
  id?: string;
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
