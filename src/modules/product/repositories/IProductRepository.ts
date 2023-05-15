import Product from '@modules/product/infra/typeorm/entities/Product';
import { ICreateProductDTO } from '@modules/product/dtos/ICreateProductDTO';

export default interface IProductRepository {
  findById(id: string): Promise<Product | undefined>;
  findByReference(reference: string): Promise<Product | undefined>;
  create(data: ICreateProductDTO): Promise<Product>;
  save(product: Product): Promise<Product>;
  list(customerId: string): Promise<Product[]>;
  delete(id: string): Promise<void>;
  deletePrices(productId: string): Promise<void>;
  deleteTissues(productId: string): Promise<void>;
}
