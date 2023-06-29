import { injectable, inject } from 'tsyringe';
import IProductTissueRepository from '@modules/productTissue/repositories/IProductTissueRepository';

@injectable()
class DeleteProductTissueService {
  constructor(
    @inject('ProductTissueRepository')
    private productTissueRepository: IProductTissueRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.productTissueRepository.deleteTissue(id);
  }
}

export default DeleteProductTissueService;
