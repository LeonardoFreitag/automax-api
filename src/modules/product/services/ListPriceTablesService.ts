import { injectable, inject } from 'tsyringe';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import { PriceTableModel } from '@models/PriceTableModel';

@injectable()
class ListPriceTablesService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute(
    customerId: string,
    regionId: string,
    includeInactive = false,
  ): Promise<PriceTableModel[]> {
    const priceTables = await this.productRepository.listPriceTables(
      customerId,
      regionId,
      includeInactive,
    );

    return priceTables;
  }
}

export default ListPriceTablesService;
