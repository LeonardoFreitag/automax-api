import AppError from '@shared/errors/AppError';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import { injectable, inject } from 'tsyringe';
import { ProductTissue } from '@prisma/client';

@injectable()
class UpdateProductTissueService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute(data: ProductTissue): Promise<ProductTissue> {
    const { id } = data;
    const productTissue = await this.productRepository.findTissueById(id);

    if (!productTissue) {
      throw new AppError('Product Price not found');
    }

    productTissue.code = data.code;
    productTissue.description = data.description;
    productTissue.type = data.type;
    productTissue.underConsultation = data.underConsultation;
    productTissue.inRestocked = data.inRestocked;

    return this.productRepository.saveTissue(productTissue);
  }
}

export default UpdateProductTissueService;
