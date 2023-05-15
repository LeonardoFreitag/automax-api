import { injectable, inject } from 'tsyringe';
import Client from '@modules/client/infra/typeorm/entities/Client';
import IClientRepository from '@modules/client/repositories/IClientRepository';

@injectable()
class ListClientService {
  constructor(
    @inject('ClientRepository')
    private clientRepository: IClientRepository,
  ) {}

  public async execute(customerId: string): Promise<Client[] | undefined> {
    const allClientByidCustomer = await this.clientRepository.list(customerId);

    return allClientByidCustomer;
  }
}

export default ListClientService;
