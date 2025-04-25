import { injectable, inject } from 'tsyringe';
import IClientRepository from '@modules/client/repositories/IClientRepository';
import { Client, Prisma } from '@prisma/client';

@injectable()
class CreateClientService {
  constructor(
    @inject('ClientRepository')
    private clientRepository: IClientRepository,
  ) {}

  public async execute({
    customerId,
    code,
    companyName,
    comercialName,
    zipCode,
    streetName,
    streetNumber,
    neighborhood,
    complement,
    cnpj,
    ie,
    cityCode,
    city,
    stateCode,
    state,
    financialPendency,
    isNew,
    sellerId,
    phone,
    cellphone,
    email,
    ClientContact,
    ClientPaymentForm,
  }: Prisma.ClientUncheckedCreateInput): Promise<Client> {
    const checkClientExists = await this.clientRepository.findByCnpj(cnpj);

    if (checkClientExists) {
      this.clientRepository.delete(checkClientExists.id);
    }

    const client = await this.clientRepository.create({
      customerId,
      code,
      companyName,
      comercialName,
      zipCode,
      streetName,
      streetNumber,
      neighborhood,
      complement,
      cnpj,
      ie,
      cityCode,
      city,
      stateCode,
      state,
      financialPendency,
      isNew,
      sellerId,
      phone,
      cellphone,
      email,
      ClientContact,
      ClientPaymentForm,
    });

    return client;
  }
}

export default CreateClientService;
