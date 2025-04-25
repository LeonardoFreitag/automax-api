import { injectable, inject } from 'tsyringe';
import IClientTempRepository from '@modules/clientTemp/repositories/IClientTempRepository';
import { ClientTemp } from '@prisma/client';
import { ICreateClientTempDTO } from '../dtos/ICreateClientTempDTOS';

@injectable()
class CreateClientTempService {
  constructor(
    @inject('ClientTempRepository')
    private clientTempRepository: IClientTempRepository,
  ) {}

  public async execute({
    customerId,
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
    sellerId,
    downloaded,
    phone,
    cellphone,
    email,
    ClientContactTemp,
  }: ICreateClientTempDTO): Promise<ClientTemp> {
    const clientTemp = await this.clientTempRepository.create({
      customerId,
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
      sellerId,
      downloaded,
      phone,
      cellphone,
      email,
      ClientContactTemp,
    });
    return clientTemp;
  }
}

export default CreateClientTempService;
