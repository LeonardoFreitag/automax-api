import { ClientPaymentFormModel } from './ClientPaymentFormModel';
import { ClientContactModel } from './ClientContactModel';

export interface ClientModel {
  id: string;
  customerId: string;
  code: string;
  companyName: string;
  comercialName: string;
  streetName: string;
  streetNumber: string;
  neighborhood: string;
  complement: string;
  cnpj: string;
  ie: string;
  cityCode: string;
  city: string;
  stateCode: string;
  state: string;
  financialPendency: boolean;
  contacts: ClientContactModel[];
  paymentForm: ClientPaymentFormModel[];
  isNew: boolean;
  isActivated: boolean;
}
