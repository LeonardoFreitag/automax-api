import { injectable, inject } from 'tsyringe';
import IClientTempRepository from '@modules/clientTemp/repositories/IClientTempRepository';
import { ClientTemp } from '@prisma/client';

@injectable()
class ChangeDownloadedService {
  constructor(
    @inject('ClientTempRepository')
    private clientTempRepository: IClientTempRepository,
  ) {}

  public async execute(id: string, downloaded: boolean): Promise<ClientTemp> {
    const clientTemp = await this.clientTempRepository.changeDownloaded(
      id,
      downloaded,
    );

    return clientTemp;
  }
}

export default ChangeDownloadedService;
