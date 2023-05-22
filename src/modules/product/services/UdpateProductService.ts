import AppError from '@shared/errors/AppError';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import { injectable, inject } from 'tsyringe';
import { Product } from '@prisma/client';

@injectable()
class UpdateProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute(data: Product): Promise<Product> {
    const { id } = data;
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found');
    }

    product.code = data.code;
    product.reference = data.reference;
    product.description = data.description;
    product.unity = data.unity;
    product.groupId = data.groupId;
    product.group = data.group;

    return this.productRepository.save(product);
  }
}

export default UpdateProductService;
