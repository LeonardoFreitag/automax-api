import { injectable, inject } from 'tsyringe';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import { Product, ProductPrice } from '@prisma/client';

@injectable()
class ListProductByTableCodeService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute(
    customerId: string,
    productCode: string,
    tableCode: string,
    regionId: string,
  ): Promise<ProductPrice | undefined> {
    const productFound = await this.productRepository.findByTablecode(
      customerId,
      productCode,
      tableCode,
      regionId,
    );

    return productFound;
  }
}

export default ListProductByTableCodeService;
