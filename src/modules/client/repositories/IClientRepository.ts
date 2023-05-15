import Client from '@modules/client/infra/typeorm/entities/Client';
import { ICreateClientDTO } from '@modules/client/dtos/ICreateClientDTO';

export default interface IClientRepository {
  findById(id: string): Promise<Client | undefined>;
  findByCnpj(cnpj: string): Promise<Client | undefined>;
  create(data: ICreateClientDTO): Promise<Client>;
  save(client: Client): Promise<Client>;
  list(customerId: string): Promise<Client[]>;
  delete(id: string): Promise<void>;
  deleteContacts(clientId: string): Promise<void>;
  deletePaymentForms(clientId: string): Promise<void>;
}
