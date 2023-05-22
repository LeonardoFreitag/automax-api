import { injectable, inject } from 'tsyringe';
import IClientRepository from '@modules/client/repositories/IClientRepository';

@injectable()
class DeleteClientPaymentFormService {
  constructor(
    @inject('ClientRepository')
    private clientRepository: IClientRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.clientRepository.deletePaymentForm(id);
  }
}

export default DeleteClientPaymentFormService;
