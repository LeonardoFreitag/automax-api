import AppError from '@shared/errors/AppError';
import IClientRepository from '@modules/client/repositories/IClientRepository';
import { injectable, inject } from 'tsyringe';
import { Client, Prisma } from '@prisma/client';

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
      const ContactList = contact.map(item => {
        return {
          name: item.name,
          fone: item.fone,
          foneType: item.foneType,
          isWhatsApp: item.isWhatsApp,
          email: item.email,
          job: item.job,
        };
      });

      const PaymentFormList = paymentForm.map(item => {
        return {
          paymentFormId: item.paymentFormId,
          description: item.description,
          installmentsLimit: item.installmentsLimit,
        };
      });

      const newClient = await this.clientRepository.create({
        customerId: data.customerId,
        code: data.code,
        companyName: data.companyName,
        comercialName: data.comercialName,
        zipCode: data.zipCode,
        streetName: data.streetName,
        streetNumber: data.streetNumber,
        neighborhood: data.neighborhood,
        complement: data.complement,
        cnpj: data.cnpj,
        ie: data.ie,
        cityCode: data.cityCode,
        city: data.city,
        stateCode: data.stateCode,
        state: data.state,
        financialPendency: data.financialPendency,
        isNew: data.isNew,
        sellerId: data.sellerId,
        phone: data.phone,
        cellphone: data.cellphone,
        email: data.email,
        ClientContact:
          ContactList as Prisma.ClientContactUncheckedCreateNestedManyWithoutClientInput,
        ClientPaymentForm:
          PaymentFormList as Prisma.ClientPaymentFormUncheckedCreateNestedManyWithoutClientInput,
      });

      return newClient;
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
    client.phone = data.phone;
    client.cellphone = data.cellphone;
    client.email = data.email;

    return this.clientRepository.save(client);
  }
}

export default UpdateClientService;
