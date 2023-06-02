import { injectable, inject } from 'tsyringe';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import { Product } from '@prisma/client';

@injectable()
class ListProductByGroupIdService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute(
    customerId: string,
    groupId: string,
  ): Promise<Product[] | undefined> {
    const allProductByidCustomer = await this.productRepository.listByGroupId(
      customerId,
      groupId,
    );

    return allProductByidCustomer;
  }
}

export default ListProductByGroupIdService;
