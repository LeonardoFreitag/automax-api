import {
  Client,
  ClientContact,
  ClientPaymentForm,
  Prisma,
} from '@prisma/client';

export default interface IClientRepository {
  findById(id: string): Promise<Client | undefined>;
  findByCnpj(cnpj: string): Promise<Client | undefined>;
  create(data: Prisma.ClientUncheckedCreateInput): Promise<Client>;
  save(client: Client): Promise<Client>;
  list(customerId: string): Promise<Client[]>;
  listBySellerId(customerId: string, sellerId: string): Promise<Client[]>;
  delete(id: string): Promise<void>;
  changeActivation(id: string, isActivated: boolean): Promise<Client>;

  createContact(
    data: Prisma.ClientContactUncheckedCreateInput,
  ): Promise<ClientContact>;
  createManyContact(
    data: Prisma.ClientContactUncheckedCreateInput[],
  ): Promise<void>;
  deleteContact(id: string): Promise<void>;
  deleteContacts(clientId: string): Promise<void>;
  findContactById(id: string): Promise<ClientContact | undefined>;
  saveContact(clientContact: ClientContact): Promise<ClientContact>;

  createPaymentForm(
    data: Prisma.ClientPaymentFormUncheckedCreateInput,
  ): Promise<ClientPaymentForm>;
  createManyPaymentForm(
    data: Prisma.ClientPaymentFormUncheckedCreateInput[],
  ): Promise<void>;
  deletePaymentForm(id: string): Promise<void>;
  deletePaymentForms(clientId: string): Promise<void>;
  findPaymentFormById(id: string): Promise<ClientPaymentForm | undefined>;
  findByClientCodePaymentId(
    customerId: string,
    code: string,
    paymentFormId: string,
  ): Promise<ClientPaymentForm | undefined>;
  savePaymentForm(
    clientPaymentForm: ClientPaymentForm,
  ): Promise<ClientPaymentForm>;
}
