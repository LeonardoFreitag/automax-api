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
    sellerId,
    saleNumber,
    saleDate,
    clientId,
    amount,
    discount,
    increment,
    total,
    notes,
    saleStatus,
    refusedNotes,
    returnedNotes,
    signatureBase64,
    SaleItems,
    SalePaymentForm,
  }: Prisma.SaleUncheckedCreateInput): Promise<Sale> {
    const sale = await this.saleRepository.create({
      customerId,
      sellerId,
      saleNumber,
      saleDate,
      clientId,
      amount,
      discount,
      increment,
      total,
      notes,
      saleStatus,
      refusedNotes,
      returnedNotes,
      signatureBase64,
      SaleItems,
      SalePaymentForm,
    });

    return sale;
  }
}

export default CreateSaleService;
