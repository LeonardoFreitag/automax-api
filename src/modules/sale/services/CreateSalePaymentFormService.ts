import { injectable, inject } from 'tsyringe';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import { Prisma, SalePaymentForm } from '@prisma/client';

@injectable()
class CreateSalePaymentFormervice {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute({
    saleId,
    paymentFormId,
    description,
    amount,
    installments,
  }: Prisma.SalePaymentFormUncheckedCreateInput): Promise<SalePaymentForm> {
    const salePaymentForm = await this.saleRepository.createPaymentForm({
      saleId,
      paymentFormId,
      description,
      amount,
      installments,
    });

    return salePaymentForm;
  }
}

export default CreateSalePaymentFormervice;
