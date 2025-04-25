export interface ClientContactTempModel {
  clientTempId: string;
  name: string;
  fone: string;
  foneType: string;
  isWhatsApp: boolean;
  email: string;
  job: string;
}

export interface ICreateClientTempDTO {
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
  sellerId: string;
  phone?: string;
  cellphone?: string;
  email?: string;
  downloaded: boolean;
  ClientContactTemp: ClientContactTempModel[];
}
