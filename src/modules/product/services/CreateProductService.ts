import { injectable, inject } from 'tsyringe';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import Product from '@modules/product/infra/typeorm/entities/Product';
import { ICreateProductDTO } from '@modules/product/dtos/ICreateProductDTO';

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute({
    customerId,
    code,
    reference,
    description,
    unity,
    groupId,
    group,
    price,
    tissue,
  }: ICreateProductDTO): Promise<Product> {
    const checkProductExists = await this.productRepository.findByReference(
      reference,
    );

    if (checkProductExists) {
      this.productRepository.delete(checkProductExists.id);
    }

    const product = await this.productRepository.create({
      customerId,
      code,
      reference,
      description,
      unity,
      groupId,
      group,
      price,
      tissue,
    });

    return product;
  }
}

export default CreateProductService;
