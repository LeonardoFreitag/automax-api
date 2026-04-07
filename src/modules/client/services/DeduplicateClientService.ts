import { inject, injectable } from 'tsyringe';
import IClientRepository from '../repositories/IClientRepository';

@injectable()
class DeduplicateClientService {
  constructor(
    @inject('ClientRepository')
    private clientRepository: IClientRepository,
  ) {}

  public async execute(
    customerId: string,
    clientId: string,
    code: string,
  ): Promise<string> {
    const result = await this.clientRepository.deduplicateClient(
      customerId,
      clientId,
      code,
    );
    return result;
  }
}

export default DeduplicateClientService;
