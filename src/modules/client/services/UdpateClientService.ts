import AppError from '@shared/errors/AppError';
import IClientRepository from '@modules/client/repositories/IClientRepository';
import { injectable, inject } from 'tsyringe';
import { Client } from '@prisma/client';

interface ContactUpdateModel {
  clientId: string;
  name: string;
  fone: string;
  foneType: string;
  isWhatsApp: boolean;
  email: string;
  job: string;
}

interface PaymentFormUpdateModel {
  clientId: string;
  paymentFormId: string;
  description: string;
  installmentsLimit: number;
}

@injectable()
class UpdateClientService {
  constructor(
    @inject('ClientRepository')
    private clientRepository: IClientRepository,
  ) {}

  public async execute(
    data: Client,
    contact: ContactUpdateModel[],
    paymentForm: PaymentFormUpdateModel[],
  ): Promise<Client> {
    const client = await this.clientRepository.findById(data.id as string);

    if (!client) {
      throw new AppError('Client not found');
    }

    await this.clientRepository.deleteContacts(data.id as string);
    await this.clientRepository.deletePaymentForms(data.id as string);

    await this.clientRepository.createManyContact(contact);

    await this.clientRepository.createManyPaymentForm(paymentForm);

    client.code = data.code as string;
    client.companyName = data.companyName;
    client.comercialName = data.comercialName;
    client.zipCode = data.zipCode;
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
    client.sellerId = data.sellerId;

    return this.clientRepository.save(client);
  }
}

export default UpdateClientService;
