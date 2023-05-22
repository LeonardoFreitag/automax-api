import { injectable, inject } from 'tsyringe';
import IProductRepository from '@modules/product/repositories/IProductRepository';

@injectable()
class DeleteProductPriceService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.productRepository.deletePrice(id);
  }
}

export default DeleteProductPriceService;
