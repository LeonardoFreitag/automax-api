import { getRepository, Repository } from 'typeorm';
import IClientRepository from '@modules/client/repositories/IClientRepository';
import { ICreateClientDTO } from '@modules/client/dtos/ICreateClientDTO';
import Client from '../entities/Client';
import ClientContact from '../entities/ClientContact';
import ClientPaymentForm from '../entities/ClientPaymentForm';

class ClientRepository implements IClientRepository {
  private ormRepository: Repository<Client>;

  private ormContactRepository: Repository<ClientContact>;

  private ormPaymentFormRepository: Repository<ClientPaymentForm>;

  constructor() {
    this.ormRepository = getRepository(Client);
    this.ormContactRepository = getRepository(ClientContact);
    this.ormPaymentFormRepository = getRepository(ClientPaymentForm);
  }

  public async findById(id: string): Promise<Client | undefined> {
    const client = this.ormRepository.findOne({
      where: { id },
    });

    return client;
  }

  public async findByCnpj(cnpj: string): Promise<Client | undefined> {
    const client = this.ormRepository.findOne({
      where: { cnpj },
    });

    return client;
  }

  public async list(customerId: string): Promise<Client[]> {
    const Clients = this.ormRepository.find({
      where: {
        customerId,
      },
      join: {
        alias: 'client',
        leftJoinAndSelect: {
          contacts: 'client.contacts',
          paymentForm: 'client.paymentForm',
        },
      },
    });

    return Clients;
  }

  public async create(clientData: ICreateClientDTO): Promise<Client> {
    const client = this.ormRepository.create(clientData);

    await this.ormRepository.save(client);

    return client;
  }

  public async save(client: Client): Promise<Client> {
    return this.ormRepository.save(client);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async deleteContacts(clientId: string): Promise<void> {
    await this.ormContactRepository.delete({ clientId });
  }

  public async deletePaymentForms(clientId: string): Promise<void> {
    await this.ormPaymentFormRepository.delete({ clientId });
  }
}

export default ClientRepository;
