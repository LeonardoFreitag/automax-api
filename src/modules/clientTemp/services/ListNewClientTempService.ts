import { injectable, inject } from 'tsyringe';
import IClientTempRepository from '@modules/clientTemp/repositories/IClientTempRepository';
import { ClientTemp } from '@prisma/client';

@injectable()
class ListNewClientTempService {
  constructor(
    @inject('ClientTempRepository')
    private clientTempRepository: IClientTempRepository,
  ) {}

  public async execute(customerId: string): Promise<ClientTemp[]> {
    const listClient = await this.clientTempRepository.listNewClientsTemp(
      customerId,
    );

    return listClient;
  }
}

export default ListNewClientTempService;
