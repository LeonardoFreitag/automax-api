import { ICreateClientPaymentFormDTO } from './ICrearteClientPaymentFormDTO';
import { ICreateClientContactDTO } from './ICreateClientContactDTO';

export interface ICreateClientDTO {
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
  contacts: ICreateClientContactDTO[];
  financialPendency: boolean;
  paymentForm: ICreateClientPaymentFormDTO[];
  isNew: boolean;
}
