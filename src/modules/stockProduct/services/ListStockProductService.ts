import { injectable, inject } from 'tsyringe';
import IStockProductRepository from '@modules/stockProduct/repositories/IStockProductRepository';
import { StockProduct } from '@prisma/client';

@injectable()
class ListStockProductService {
  constructor(
    @inject('StockProductRepository')
    private stockProductRepository: IStockProductRepository,
  ) {}

  public async execute(
    customerId: string,
    includeInactive = false,
  ): Promise<StockProduct[]> {
    const allStockProductByCustomer = await this.stockProductRepository.list(
      customerId,
      includeInactive,
    );

    return allStockProductByCustomer;
  }
}

export default ListStockProductService;
