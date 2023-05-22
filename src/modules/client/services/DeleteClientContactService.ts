import { injectable, inject } from 'tsyringe';
import IClientRepository from '@modules/client/repositories/IClientRepository';

@injectable()
class DeleteClientContactService {
  constructor(
    @inject('ClientRepository')
    private clientRepository: IClientRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.clientRepository.deleteContact(id);
  }
}

export default DeleteClientContactService;
