import { injectable, inject } from 'tsyringe';
import IStockProductRepository from '@modules/stockProduct/repositories/IStockProductRepository';

@injectable()
class CheckExistsStockProductService {
  constructor(
    @inject('StockProductRepository')
    private stockProductRepository: IStockProductRepository,
  ) {}

  public async execute(stockProductId: string): Promise<boolean> {
    const existsStockProduct = await this.stockProductRepository.findById(
      stockProductId,
    );

    if (!existsStockProduct) {
      return false;
    }

    return true;
  }
}

export default CheckExistsStockProductService;
