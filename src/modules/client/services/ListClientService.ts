import { injectable, inject } from 'tsyringe';
import IClientRepository from '@modules/client/repositories/IClientRepository';
import { Client } from '@prisma/client';

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
