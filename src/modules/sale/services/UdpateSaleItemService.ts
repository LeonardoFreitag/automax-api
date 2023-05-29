import AppError from '@shared/errors/AppError';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import { injectable, inject } from 'tsyringe';
import { SaleItems } from '@prisma/client';

@injectable()
class UpdateSaleService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute(data: SaleItems): Promise<SaleItems> {
    const { id } = data;
    const saleItem = await this.saleRepository.findItemById(id);

    if (!saleItem) {
      throw new AppError('Sale Item not found');
    }

    saleItem.productId = data.productId;
    saleItem.code = data.code;
    saleItem.reference = data.reference;
    saleItem.description = data.description;
    saleItem.unity = data.unity;
    saleItem.tableId = data.tableId;
    saleItem.price = data.price;
    saleItem.quantity = data.quantity;
    saleItem.amount = data.amount;
    saleItem.notes = data.notes;

    return this.saleRepository.saveItem(saleItem);
  }
}

export default UpdateSaleService;