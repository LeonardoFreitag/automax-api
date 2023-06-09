import AppError from '@shared/errors/AppError';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import { injectable, inject } from 'tsyringe';
import { Product } from '@prisma/client';

interface ProductPriceModel {
  tableName: string;
  price: number;
  height: number;
  heightUnity: string;
  minWidth: number;
  width: number;
  maxWidth: number;
  widthUnity: string;
  depth: number;
  depthUnity: string;
  depthOpen: number;
  depthOpenUnity: string;
  additionalPercentage: number;
  productId: string;
}

@injectable()
class UpdateProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute(
    data: Product,
    productPrice: ProductPriceModel[],
  ): Promise<Product> {
    const { id } = data;
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found');
    }

    await this.productRepository.deletePrices(data.id);
    const newPrices = productPrice.map(price => {
      return {
        ...price,
        productId: data.id,
      };
    });
    await this.productRepository.createManyPrice(newPrices);

    product.code = data.code;
    product.reference = data.reference;
    product.description = data.description;
    product.unity = data.unity;
    product.groupId = data.groupId;

    return this.productRepository.save(product);
  }
}

export default UpdateProductService;
