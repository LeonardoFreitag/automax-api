import { injectable, inject } from 'tsyringe';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import { Prisma, ProductTissue } from '@prisma/client';

@injectable()
class CreateProductTissueService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute({
    productId,
    code,
    description,
    type,
    underConsultation,
    inRestocked,
  }: Prisma.ProductTissueUncheckedCreateInput): Promise<ProductTissue> {
    const productPrice = await this.productRepository.createTissue({
      productId,
      code,
      description,
      type,
      underConsultation,
      inRestocked,
    });

    return productPrice;
  }
}

export default CreateProductTissueService;
