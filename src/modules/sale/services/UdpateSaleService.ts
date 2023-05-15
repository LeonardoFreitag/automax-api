import AppError from '@shared/errors/AppError';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import { injectable, inject } from 'tsyringe';

import Sale from '@modules/sale/infra/typeorm/entities/Sale';

@injectable()
class UpdateSaleService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute(data: Sale): Promise<Sale> {
    const { id } = data;
    const sale = await this.saleRepository.findById(id);

    if (!sale) {
      throw new AppError('Sale not found');
    }

    this.saleRepository.deleteItems(data.id);
    this.saleRepository.deletePaymentForm(data.id);

    sale.saleNumber = data.saleNumber;
    sale.saleDate = data.saleDate;
    sale.clientId = data.clientId;
    sale.items = data.items;
    sale.amount = data.amount;
    sale.discount = data.discount;
    sale.total = data.total;
    sale.notes = data.notes;
    sale.finished = data.finished;
    sale.sent = data.sent;
    sale.refused = data.refused;
    sale.refusedNotes = data.refusedNotes;
    sale.returned = data.returned;
    sale.returnedNotes = data.returnedNotes;
    sale.paymentForm = data.paymentForm;
    sale.signatureFileName = data.signatureFileName;
    sale.signatureUrl = data.signatureUrl;
    sale.signatureBase64 = data.signatureBase64;
    sale.accepted = data.accepted;

    return this.saleRepository.save(sale);
  }
}

export default UpdateSaleService;
