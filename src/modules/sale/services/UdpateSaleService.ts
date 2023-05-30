import AppError from '@shared/errors/AppError';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import { injectable, inject } from 'tsyringe';
import { Sale } from '@prisma/client';

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

    sale.clientId = data.clientId;
    sale.amount = data.amount;
    sale.discount = data.discount;
    sale.total = data.total;
    sale.notes = data.notes;
    sale.saleStatus = data.saleStatus;
    sale.refusedNotes = data.refusedNotes;
    sale.returnedNotes = data.returnedNotes;
    sale.signatureFileName = data.signatureFileName;
    sale.signatureUrl = data.signatureUrl;
    sale.signatureBase64 = data.signatureBase64;

    return this.saleRepository.save(sale);
  }
}

export default UpdateSaleService;
