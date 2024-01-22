import AppError from '@shared/errors/AppError';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import { injectable, inject } from 'tsyringe';
import { Prisma, Product } from '@prisma/client';

interface ProductPriceModel {
  code: string;
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
  regionId: string;
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
      const priceList = productPrice.map(price => {
        return {
          productId: data.id,
          code: price.code,
          tableName: price.tableName,
          price: price.price,
          height: price.height,
          heightUnity: price.heightUnity,
          minWidth: price.minWidth,
          width: price.width,
          maxWidth: price.maxWidth,
          widthUnity: price.widthUnity,
          depth: price.depth,
          depthUnity: price.depthUnity,
          depthOpen: price.depthOpen,
          depthOpenUnity: price.depthOpenUnity,
          additionalPercentage: price.additionalPercentage,
          regionId: price.regionId,
        };
      });

      const newProduct = await this.productRepository.create({
        customerId: data.customerId,
        code: data.code,
        reference: data.reference,
        description: data.description,
        unity: data.unity,
        groupId: data.groupId,
        ProductPrice:
          priceList as Prisma.ProductPriceUncheckedCreateNestedManyWithoutProductInput,
      });

      return newProduct;
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
