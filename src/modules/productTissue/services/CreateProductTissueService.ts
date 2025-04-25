import { injectable, inject } from 'tsyringe';
import IProductTissueRepository from '@modules/productTissue/repositories/IProductTissueRepository';
import { Prisma, ProductTissue } from '@prisma/client';
import AppError from '@shared/errors/AppError';

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
    const productTissueExists =
      await this.productTissueRepository.findTissueByCode(code, customerId);

    if (productTissueExists) {
      return productTissueExists;
    }

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
