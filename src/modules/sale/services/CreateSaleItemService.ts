import { injectable, inject } from 'tsyringe';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import { Prisma, SaleItems } from '@prisma/client';

@injectable()
class CreateSaleItemService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute({
    saleId,
    productId,
    code,
    reference,
    description,
    unity,
    tableId,
    price,
    quantity,
    amount,
    notes,
  }: Prisma.SaleItemsUncheckedCreateInput): Promise<SaleItems> {
    const saleItem = await this.saleRepository.createItems({
      saleId,
      productId,
      code,
      reference,
      description,
      unity,
      tableId,
      price,
      quantity,
      amount,
      notes,
    });

    return saleItem;
  }
}

export default CreateSaleItemService;
