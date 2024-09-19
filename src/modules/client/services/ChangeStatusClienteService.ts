import { injectable, inject } from 'tsyringe';
import IClientRepository from '@modules/client/repositories/IClientRepository';
import { Client } from '@prisma/client';

@injectable()
class ChangeStatusClienteService {
  constructor(
    @inject('ClientRepository')
    private clientRepository: IClientRepository,
  ) {}

  public async execute(id: string, isActivated: boolean): Promise<Client> {
    const clientUpdated = await this.clientRepository.changeActivation(
      id,
      isActivated,
    );

    return clientUpdated;
  }
}

export default ChangeStatusClienteService;
