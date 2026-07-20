import { injectable, inject } from 'tsyringe';
import IStockProductRepository from '@modules/stockProduct/repositories/IStockProductRepository';
import { StockProduct } from '@prisma/client';

@injectable()
class UpdateStockProductService {
  constructor(
    @inject('StockProductRepository')
    private stockProductRepository: IStockProductRepository,
  ) {}

  public async execute(data: StockProduct): Promise<StockProduct> {
    const stockProduct = await this.stockProductRepository.findById(data.id);

    if (!stockProduct) {
      const newStockProduct = await this.stockProductRepository.create({
        ...(data.id && { id: data.id }),
        customerId: data.customerId,
        code: data.code,
        reference: data.reference,
        description: data.description,
        unity: data.unity,
      });

      return newStockProduct;
    }

    stockProduct.code = data.code;
    stockProduct.reference = data.reference;
    stockProduct.description = data.description;
    stockProduct.unity = data.unity;

    return this.stockProductRepository.save(stockProduct);
  }
}

export default UpdateStockProductService;
