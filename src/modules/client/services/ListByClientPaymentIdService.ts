import { injectable, inject } from 'tsyringe';
import IClientRepository from '@modules/client/repositories/IClientRepository';
import { Client, ClientPaymentForm } from '@prisma/client';

@injectable()
class ListByClientPaymentIdService {
  constructor(
    @inject('ClientRepository')
    private clientRepository: IClientRepository,
  ) {}

  public async execute(
    customerId: string,
    code: string,
    paymentFormId: string,
  ): Promise<ClientPaymentForm | undefined> {
    const allClientByidCustomer =
      await this.clientRepository.findByClientCodePaymentId(
        customerId,
        code,
        paymentFormId,
      );

    return allClientByidCustomer;
  }
}

export default ListByClientPaymentIdService;
