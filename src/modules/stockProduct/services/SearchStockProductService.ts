import { injectable, inject } from 'tsyringe';
import IStockProductRepository from '@modules/stockProduct/repositories/IStockProductRepository';
import { StockProduct } from '@prisma/client';

@injectable()
class SearchStockProductService {
  constructor(
    @inject('StockProductRepository')
    private stockProductRepository: IStockProductRepository,
  ) {}

  // busca por código, referência (código de barras) ou descrição
  public async execute(
    customerId: string,
    search: string,
  ): Promise<StockProduct[]> {
    const stockProducts = await this.stockProductRepository.search(
      customerId,
      search,
    );

    return stockProducts;
  }
}

export default SearchStockProductService;
