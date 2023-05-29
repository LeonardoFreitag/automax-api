import AppError from '@shared/errors/AppError';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import { injectable, inject } from 'tsyringe';
import { ProductPrice } from '@prisma/client';

@injectable()
class UpdateProductPriceService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute(data: ProductPrice): Promise<ProductPrice> {
    const { id } = data;
    const productPrice = await this.productRepository.findPriceById(id);

    if (!productPrice) {
      throw new AppError('Product Price not found');
    }

    productPrice.tableName = data.tableName;
    productPrice.price = data.price;
    productPrice.height = data.height;
    productPrice.heightUnity = data.heightUnity;
    productPrice.minWidth = data.minWidth;
    productPrice.width = data.width;
    productPrice.maxWidth = data.maxWidth;
    productPrice.widthUnity = data.widthUnity;
    productPrice.depth = data.depth;
    productPrice.depthUnity = data.depthUnity;
    productPrice.depthOpen = data.depthOpen;
    productPrice.depthOpenUnity = data.depthOpenUnity;
    productPrice.additionalPercentage = data.additionalPercentage;

    return this.productRepository.savePrice(productPrice);
  }
}

export default UpdateProductPriceService;
