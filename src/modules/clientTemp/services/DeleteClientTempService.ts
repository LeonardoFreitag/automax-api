import { injectable, inject } from 'tsyringe';
import IClientTempRepository from '@modules/clientTemp/repositories/IClientTempRepository';

@injectable()
class DeleteClientTempService {
  constructor(
    @inject('ClientTempRepository')
    private clientTempRepository: IClientTempRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.clientTempRepository.delete(id);
  }
}

export default DeleteClientTempService;
