import { injectable, inject } from 'tsyringe';
import IClientRepository from '@modules/client/repositories/IClientRepository';
import { Client } from '@prisma/client';

@injectable()
class ListClientBySellerIdService {
  constructor(
    @inject('ClientRepository')
    private clientRepository: IClientRepository,
  ) {}

  public async execute(
    customerId: string,
    sellerId: string,
  ): Promise<Client[] | undefined> {
    const allClientByidCustomer = await this.clientRepository.listBySellerId(
      customerId,
      sellerId,
    );

    return allClientByidCustomer;
  }
}

export default ListClientBySellerIdService;
