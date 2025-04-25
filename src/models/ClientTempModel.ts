import { ClientContactTempModel } from './ClientContactTempModel';

export interface ClientTempModel {
  id: string;
  customerId: string;
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
  downloaded: boolean;
  contacts?: ClientContactTempModel[];
}
