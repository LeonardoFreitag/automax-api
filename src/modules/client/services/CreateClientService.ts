import { injectable, inject } from 'tsyringe';
import IClientRepository from '@modules/client/repositories/IClientRepository';
import Client from '@modules/client/infra/typeorm/entities/Client';
import { ICreateClientDTO } from '@modules/client/dtos/ICreateClientDTO';

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
    contacts,
    financialPendency,
    paymentForm,
    isNew,
  }: ICreateClientDTO): Promise<Client> {
    const checkClientExists = await this.clientRepository.findByCnpj(cnpj);

    if (checkClientExists) {
      this.clientRepository.delete(checkClientExists.id);
    }

    const client = await this.clientRepository.create({
      customerId,
      code,
      companyName,
      comercialName,
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
      contacts,
      financialPendency,
      paymentForm,
      isNew,
    });

    return client;
  }
}

export default CreateClientService;
