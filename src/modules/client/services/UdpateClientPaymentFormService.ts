import AppError from '@shared/errors/AppError';
import IClientRepository from '@modules/client/repositories/IClientRepository';
import { injectable, inject } from 'tsyringe';
import { ClientPaymentForm } from '@prisma/client';

@injectable()
class UpdateClientService {
  constructor(
    @inject('ClientRepository')
    private clientRepository: IClientRepository,
  ) {}

  public async execute(data: ClientPaymentForm): Promise<ClientPaymentForm> {
    const { id } = data;
    const paymentForm = await this.clientRepository.findPaymentFormById(id);

    if (!paymentForm) {
      throw new AppError('PaymentForm not found');
    }

    paymentForm.paymentFormId = data.paymentFormId;
    paymentForm.description = data.description;
    paymentForm.installmentsLimit = data.installmentsLimit;

    return this.clientRepository.savePaymentForm(paymentForm);
  }
}

export default UpdateClientService;
