import { injectable, inject } from 'tsyringe';
import IProductTissueRepository from '@modules/productTissue/repositories/IProductTissueRepository';
import { ProductTissue } from '@prisma/client';

@injectable()
class ListProductTissueByProductPriceIdService {
  constructor(
    @inject('ProductTissueRepository')
    private productTissueRepository: IProductTissueRepository,
  ) {}

  public async execute(
    productPriceId: string,
  ): Promise<ProductTissue[] | undefined> {
    const allProductTissueByidCustomer =
      await this.productTissueRepository.listTissuesByProductPrice(
        productPriceId,
      );

    return allProductTissueByidCustomer;
  }
}

export default ListProductTissueByProductPriceIdService;
