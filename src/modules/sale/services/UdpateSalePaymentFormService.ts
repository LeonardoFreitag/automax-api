import AppError from '@shared/errors/AppError';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import { injectable, inject } from 'tsyringe';
import { SalePaymentForm } from '@prisma/client';

@injectable()
class UpdateSaleService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute(data: SalePaymentForm): Promise<SalePaymentForm> {
    const { id } = data;
    const salePaymentForm = await this.saleRepository.findPaymentFormById(id);

    if (!salePaymentForm) {
      throw new AppError('Sale Item not found', 404);
    }

    salePaymentForm.paymentFormId = data.paymentFormId;
    salePaymentForm.description = data.description;
    salePaymentForm.amount = data.amount;
    salePaymentForm.installments = data.installments;

    return this.saleRepository.savePaymentForm(salePaymentForm);
  }
}

export default UpdateSaleService;
