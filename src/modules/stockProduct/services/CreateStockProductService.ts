import { injectable, inject } from 'tsyringe';
import IStockProductRepository from '@modules/stockProduct/repositories/IStockProductRepository';
import { Prisma, StockProduct } from '@prisma/client';

@injectable()
class CreateStockProductService {
  constructor(
    @inject('StockProductRepository')
    private stockProductRepository: IStockProductRepository,
  ) {}

  public async execute({
    id,
    customerId,
    code,
    reference,
    description,
    unity,
  }: Prisma.StockProductUncheckedCreateInput): Promise<StockProduct> {
    const checkStockProductExists = await this.stockProductRepository.findByCode(
      customerId,
      code,
    );

    if (checkStockProductExists) {
      await this.stockProductRepository.delete(checkStockProductExists.id);
    }

    const stockProduct = await this.stockProductRepository.create({
      ...(id && { id }),
      customerId,
      code,
      reference,
      description,
      unity,
    });

    return stockProduct;
  }
}

export default CreateStockProductService;
