import { injectable, inject } from 'tsyringe';
import Product from '@modules/product/infra/typeorm/entities/Product';
import IProductRepository from '@modules/product/repositories/IProductRepository';

@injectable()
class ListProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute(customerId: string): Promise<Product[] | undefined> {
    const allProductByidCustomer = await this.productRepository.list(
      customerId,
    );

    return allProductByidCustomer;
  }
}

export default ListProductService;
