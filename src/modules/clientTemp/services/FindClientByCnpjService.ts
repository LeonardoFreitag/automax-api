import { injectable, inject } from 'tsyringe';
import IClientTempRepository from '@modules/clientTemp/repositories/IClientTempRepository';
import { ClientTemp } from '@prisma/client';
import AppError from '@shared/errors/AppError';

@injectable()
class FindClientTempByCnpjService {
  constructor(
    @inject('ClientTempRepository')
    private clientTempRepository: IClientTempRepository,
  ) {}

  public async execute(cnpj: string): Promise<ClientTemp | undefined> {
    const foundClient = await this.clientTempRepository.findByCnpj(cnpj);

    if (!foundClient) {
      throw new AppError('Client not found', 404);
    }

    return foundClient;
  }
}

export default FindClientTempByCnpjService;
