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
    creditLimit,
    discountRate,
    initialDiscountLimit,
    blocked,
    blockReason,
  }: Prisma.ClientUncheckedCreateInput): Promise<Client> {
    // O bloco que existia aqui buscava cliente pelo CNPJ e mandava apagá-lo
    // antes de criar o novo — sem `await`, sem escopo de customer e casando com
    // qualquer cliente sem documento. Três defeitos que, somados, apagavam
    // cadastro alheio, geravam duplicata e derrubavam o processo por
    // unhandled rejection.
    //
    // A decisão de criar ou atualizar passou para o controller, que consulta
    // por (customerId, cnpj) e delega ao UpdateClientService quando já existe.
    // Nada é apagado em nenhum dos caminhos.
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
      creditLimit,
      discountRate,
      initialDiscountLimit,
      blocked,
      blockReason,
    });

    return client;
  }
}

export default CreateClientService;
