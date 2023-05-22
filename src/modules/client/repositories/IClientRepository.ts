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
  delete(id: string): Promise<void>;

  createContact(
    data: Prisma.ClientContactUncheckedCreateInput,
  ): Promise<ClientContact>;
  deleteContact(id: string): Promise<void>;
  findContactById(id: string): Promise<ClientContact | undefined>;
  saveContact(clientContact: ClientContact): Promise<ClientContact>;

  createPaymentForm(
    data: Prisma.ClientPaymentFormUncheckedCreateInput,
  ): Promise<ClientPaymentForm>;
  deletePaymentForm(id: string): Promise<void>;
  findPaymentFormById(id: string): Promise<ClientPaymentForm | undefined>;
  savePaymentForm(
    clientPaymentForm: ClientPaymentForm,
  ): Promise<ClientPaymentForm>;
}
