import AppError from '@shared/errors/AppError';
import IClientRepository from '@modules/client/repositories/IClientRepository';
import { injectable, inject } from 'tsyringe';
import { Client } from '@prisma/client';

@injectable()
class UpdateClientService {
  constructor(
    @inject('ClientRepository')
    private clientRepository: IClientRepository,
  ) {}

  public async execute(data: Client): Promise<Client> {
    const { id } = data;
    const client = await this.clientRepository.findById(id);

    if (!client) {
      throw new AppError('Client not found');
    }

    client.code = data.code;
    client.companyName = data.companyName;
    client.comercialName = data.comercialName;
    client.streetName = data.streetName;
    client.streetNumber = data.streetNumber;
    client.neighborhood = data.neighborhood;
    client.complement = data.complement;
    client.cnpj = data.cnpj;
    client.ie = data.ie;
    client.cityCode = data.cityCode;
    client.city = data.city;
    client.stateCode = data.stateCode;
    client.state = data.state;
    client.financialPendency = data.financialPendency;
    client.isNew = data.isNew;

    return this.clientRepository.save(client);
  }
}

export default UpdateClientService;
