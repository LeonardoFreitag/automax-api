import { injectable, inject } from 'tsyringe';
import IStockProductRepository from '@modules/stockProduct/repositories/IStockProductRepository';
import { StockProduct } from '@prisma/client';
import AppError from '@shared/errors/AppError';

@injectable()
class FindStockProductByReferenceService {
  constructor(
    @inject('StockProductRepository')
    private stockProductRepository: IStockProductRepository,
  ) {}

  // o QR code do produto é gerado a partir do campo "reference"
  public async execute(
    customerId: string,
    reference: string,
  ): Promise<StockProduct> {
    const stockProduct = await this.stockProductRepository.findByReference(
      customerId,
      reference,
    );

    if (!stockProduct) {
      throw new AppError('Stock product not found', 404);
    }

    return stockProduct;
  }
}

export default FindStockProductByReferenceService;
