import { injectable, inject } from 'tsyringe';
import IProductTissueRepository from '@modules/productTissue/repositories/IProductTissueRepository';
import { ProductTissue } from '@prisma/client';

@injectable()
class ListProductTissueByCustomerIdService {
  constructor(
    @inject('ProductTissueRepository')
    private productTissueRepository: IProductTissueRepository,
  ) {}

  public async execute(
    customerId: string,
  ): Promise<ProductTissue[] | undefined> {
    const allProductTissueByidCustomer =
      await this.productTissueRepository.listTissuesByCustomerId(customerId);

    return allProductTissueByidCustomer;
  }
}

export default ListProductTissueByCustomerIdService;
