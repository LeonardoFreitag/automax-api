import { injectable, inject } from 'tsyringe';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import { Prisma, Sale } from '@prisma/client';

@injectable()
class CreateSaleService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute({
    customerId,
    selerId,
    saleNumber,
    saleDate,
    clientId,
    amount,
    discount,
    total,
    notes,
    finished,
    sent,
    refused,
    refusedNotes,
    returned,
    returnedNotes,
    accepted,
    SaleItems,
    SalePaymentForm,
  }: Prisma.SaleUncheckedCreateInput): Promise<Sale> {
    const sale = await this.saleRepository.create({
      customerId,
      selerId,
      saleNumber,
      saleDate,
      clientId,
      amount,
      discount,
      total,
      notes,
      finished,
      sent,
      refused,
      refusedNotes,
      returned,
      returnedNotes,
      accepted,
      SaleItems,
      SalePaymentForm,
    });

    return sale;
  }
}

export default CreateSaleService;
