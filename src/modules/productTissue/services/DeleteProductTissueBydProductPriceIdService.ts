import { injectable, inject } from 'tsyringe';
import IProductTissueRepository from '@modules/productTissue/repositories/IProductTissueRepository';

@injectable()
class DeleteProductTissueByProductPriceproductPriceIdService {
  constructor(
    @inject('ProductTissueRepository')
    private productTissueRepository: IProductTissueRepository,
  ) {}

  public async execute(productPriceId: string): Promise<void> {
    await this.productTissueRepository.deleteTissuesByProductPrice(
      productPriceId,
    );
  }
}

export default DeleteProductTissueByProductPriceproductPriceIdService;
