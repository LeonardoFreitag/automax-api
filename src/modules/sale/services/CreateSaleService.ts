import { injectable, inject } from 'tsyringe';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import Sale from '@modules/sale/infra/typeorm/entities/Sale';
import { ICreateSaleDTO } from '../dtos/ICreateSaleDTO';

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
    items,
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
    paymentForm,
    signatureFileName,
    signatureUrl,
    signatureBase64,
    accepted,
  }: ICreateSaleDTO): Promise<Sale> {
    const checkSaleExists = await this.saleRepository.findBySaleNumber(
      saleNumber,
    );

    if (checkSaleExists) {
      this.saleRepository.delete(checkSaleExists.id);
    }

    const sale = await this.saleRepository.create({
      customerId,
      selerId,
      saleNumber,
      saleDate,
      clientId,
      items,
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
      paymentForm,
      signatureFileName,
      signatureUrl,
      signatureBase64,
      accepted,
    });

    return sale;
  }
}

export default CreateSaleService;
