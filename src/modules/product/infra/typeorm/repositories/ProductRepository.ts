import { getRepository, Repository } from 'typeorm';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import { ICreateProductDTO } from '@modules/product/dtos/ICreateProductDTO';
import { ICreateProductPhotoDTO } from '@modules/product/dtos/ICreateProductPhotoDTO';
import Product from '../entities/Product';
import ProductPrice from '../entities/ProductPrice';
import ProductTissue from '../entities/ProductTissue';

class ProductRepository implements IProductRepository {
  private ormRepository: Repository<Product>;

  private ormProductPrice: Repository<ProductPrice>;

  private ormProductTissue: Repository<ProductTissue>;

  constructor() {
    this.ormRepository = getRepository(Product);
    this.ormProductPrice = getRepository(ProductPrice);
    this.ormProductTissue = getRepository(ProductTissue);
  }

  public async findById(id: string): Promise<Product | undefined> {
    const product = this.ormRepository.findOne({
      where: { id },
    });

    return product;
  }

  public async findByReference(
    reference: string,
  ): Promise<Product | undefined> {
    const product = this.ormRepository.findOne({
      where: { reference },
    });

    return product;
  }

  public async list(customerId: string): Promise<Product[]> {
    const products = this.ormRepository.find({
      where: {
        customerId,
      },
      join: {
        alias: 'product',
        leftJoinAndSelect: {
          contacts: 'product.price',
          paymentForm: 'product.tissue',
        },
      },
    });

    return products;
  }

  public async create(productData: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create(productData);

    await this.ormRepository.save(product);

    return product;
  }

  public async save(product: Product): Promise<Product> {
    return this.ormRepository.save(product);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async deletePrices(productId: string): Promise<void> {
    await this.ormProductPrice.delete({ productId });
  }

  public async deleteTissues(productId: string): Promise<void> {
    await this.ormProductTissue.delete({ productId });
  }
}

export default ProductRepository;
