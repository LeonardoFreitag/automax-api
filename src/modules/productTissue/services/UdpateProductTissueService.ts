import AppError from '@shared/errors/AppError';
import IProductTissueRepository from '@modules/productTissue/repositories/IProductTissueRepository';
import { injectable, inject } from 'tsyringe';
import { ProductTissue } from '@prisma/client';

@injectable()
class UpdateProductTissueService {
  constructor(
    @inject('ProductTissueRepository')
    private productTissueRepository: IProductTissueRepository,
  ) {}

  public async execute(data: ProductTissue): Promise<ProductTissue> {
    const productTissue = await this.productTissueRepository.findTissueByCode(
      data.code,
      data.customerId,
    );

    if (!productTissue) {
      const newProductTissue = await this.productTissueRepository.createTissue({
        code: data.code,
        description: data.description,
        type: data.type,
        underConsultation: data.underConsultation,
        inRestocked: data.inRestocked,
        customerId: data.customerId,
        productPriceId: data.productPriceId,
      });

      return newProductTissue;
    }

    productTissue.code = data.code;
    productTissue.description = data.description;
    productTissue.type = data.type;
    productTissue.underConsultation = data.underConsultation;
    productTissue.inRestocked = data.inRestocked;
    productTissue.customerId = data.customerId;
    productTissue.productPriceId = data.productPriceId;

    return this.productTissueRepository.saveTissue(productTissue);
  }
}

export default UpdateProductTissueService;
