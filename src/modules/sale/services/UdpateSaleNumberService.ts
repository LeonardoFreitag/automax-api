import AppError from '@shared/errors/AppError';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import { injectable, inject } from 'tsyringe';
import { Sale } from '@prisma/client';

@injectable()
class UpdateSaleNumberService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute(id: string, saleNumber: string): Promise<Sale> {
    const sale = await this.saleRepository.findById(id);

    if (!sale) {
      throw new AppError('Sale not found', 404);
    }

    sale.saleNumber = saleNumber;

    return this.saleRepository.save(sale);
  }
}

export default UpdateSaleNumberService;
