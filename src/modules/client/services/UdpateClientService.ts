import AppError from '@shared/errors/AppError';
import IClientRepository from '@modules/client/repositories/IClientRepository';
import { injectable, inject } from 'tsyringe';

import Client from '@modules/client/infra/typeorm/entities/Client';

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

    this.clientRepository.deleteContacts(data.id);
    this.clientRepository.deletePaymentForms(data.id);

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
    client.contacts = data.contacts;
    client.financialPendency = data.financialPendency;
    client.paymentForm = data.paymentForm;
    client.isNew = data.isNew;

    return this.clientRepository.save(client);
  }
}

export default UpdateClientService;
