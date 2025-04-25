export interface ClientContact {
  name: string;
  fone: string;
  foneType: string;
  isWhatsApp: boolean;
  email: string;
  job: string;
}

export interface ClientPaymentForm {
  paymentFormId: string;
  description: string;
  installmentsLimit: number;
}

export interface ICreateClientDTO {
  customerId: string;
  companyName: string;
  comercialName: string;
  zipCode: string;
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
  isNew: boolean;
  sellerId: string;
  phone?: string;
  cellphone?: string;
  email?: string;
  ClientContact: ClientContact[];
}
