import AppError from '@shared/errors/AppError';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import { injectable, inject } from 'tsyringe';
import { Sale } from '@prisma/client';

interface SaleStatus {
  id: string;
  saleNumber: string;
  saleStatus: string;
  refusedNotes: string;
}

@injectable()
class UpdateSaleStatusService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute(data: SaleStatus): Promise<Sale> {
    const { id } = data;
    const sale = await this.saleRepository.findById(id);

    if (!sale) {
      throw new AppError('Sale not found');
    }

    sale.saleNumber = data.saleNumber;
    sale.saleStatus = data.saleStatus;
    sale.refusedNotes = data.refusedNotes;

    return this.saleRepository.save(sale);
  }
}

export default UpdateSaleStatusService;
