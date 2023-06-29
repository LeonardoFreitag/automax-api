import { injectable, inject } from 'tsyringe';
import IProductTissueRepository from '@modules/productTissue/repositories/IProductTissueRepository';
import { Prisma, ProductTissue } from '@prisma/client';

@injectable()
class CreateProductTissueService {
  constructor(
    @inject('ProductTissueRepository')
    private productTissueRepository: IProductTissueRepository,
  ) {}

  public async execute({
    code,
    description,
    type,
    underConsultation,
    inRestocked,
    customerId,
    productPriceId,
  }: Prisma.ProductTissueUncheckedCreateInput): Promise<ProductTissue> {
    const productPrice = await this.productTissueRepository.createTissue({
      code,
      description,
      type,
      underConsultation,
      inRestocked,
      customerId,
      productPriceId,
    });

    return productPrice;
  }
}

export default CreateProductTissueService;
