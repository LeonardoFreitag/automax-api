import { injectable, inject } from 'tsyringe';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import { Prisma, ProductPrice } from '@prisma/client';

@injectable()
class CreateProductPriceService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute({
    productId,
    tableName,
    price,
    height,
    heightUnity,
    width,
    widthUnity,
    depth,
    depthUnity,
    depthOpen,
    depthOpenUnity,
    addtitionalPercentage,
  }: Prisma.ProductPriceUncheckedCreateInput): Promise<ProductPrice> {
    const productPrice = await this.productRepository.createPrice({
      productId,
      tableName,
      price,
      height,
      heightUnity,
      width,
      widthUnity,
      depth,
      depthUnity,
      depthOpen,
      depthOpenUnity,
      addtitionalPercentage,
    });

    return productPrice;
  }
}

export default CreateProductPriceService;
