import { injectable, inject } from 'tsyringe';
import IClientRepository from '@modules/client/repositories/IClientRepository';
import { ClientContact, ClientPaymentForm, Prisma } from '@prisma/client';

@injectable()
class CreateClientPaymentFormaService {
  constructor(
    @inject('ClientRepository')
    private clientRepository: IClientRepository,
  ) {}

  public async execute({
    paymentFormId,
    description,
    installmentsLimit,
    clientId,
  }: Prisma.ClientPaymentFormUncheckedCreateInput): Promise<ClientPaymentForm> {
    const paymentForm = await this.clientRepository.createPaymentForm({
      paymentFormId,
      description,
      installmentsLimit,
      clientId,
    });

    return paymentForm;
  }
}

export default CreateClientPaymentFormaService;
