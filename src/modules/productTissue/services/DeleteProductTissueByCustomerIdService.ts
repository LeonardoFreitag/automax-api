import { injectable, inject } from 'tsyringe';
import IProductTissueRepository from '@modules/productTissue/repositories/IProductTissueRepository';

@injectable()
class DeleteProductTissueByCustomerIdService {
  constructor(
    @inject('ProductTissueRepository')
    private productTissueRepository: IProductTissueRepository,
  ) {}

  public async execute(customerId: string): Promise<void> {
    await this.productTissueRepository.deleteTissuesByCustomerId(customerId);
  }
}

export default DeleteProductTissueByCustomerIdService;
