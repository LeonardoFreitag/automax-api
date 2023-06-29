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
    const { id } = data;
    const productTissue = await this.productTissueRepository.findTissueById(id);

    if (!productTissue) {
      throw new AppError('Product Price not found');
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
