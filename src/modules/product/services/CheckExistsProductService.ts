import { injectable, inject } from 'tsyringe';
import IProductRepository from '@modules/product/repositories/IProductRepository';

@injectable()
class CheckExistsProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute(productId: string): Promise<boolean> {
    const existsProduct = await this.productRepository.findById(productId);

    if (!existsProduct) {
      return false;
    }

    return true;
  }
}

export default CheckExistsProductService;
