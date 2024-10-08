import { injectable, inject } from 'tsyringe';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import { Prisma, Product } from '@prisma/client';

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute({
    customerId,
    code,
    reference,
    description,
    unity,
    groupId,
    ProductPrice,
  }: Prisma.ProductUncheckedCreateInput): Promise<Product> {
    const checkProductExists = await this.productRepository.findByProductCode(
      customerId,
      code,
    );

    if (checkProductExists) {
      await this.productRepository.delete(checkProductExists.id);
    }

    const product = await this.productRepository.create({
      customerId,
      code,
      reference,
      description,
      unity,
      groupId,
      ProductPrice,
    });

    return product;
  }
}

export default CreateProductService;
