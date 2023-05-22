import { injectable, inject } from 'tsyringe';
import IProductRepository from '@modules/product/repositories/IProductRepository';

@injectable()
class DeleteProductTissueService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.productRepository.deleteTissue(id);
  }
}

export default DeleteProductTissueService;
