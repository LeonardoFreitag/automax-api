import { Prisma, Product, ProductPrice, ProductTissue } from '@prisma/client';

export default interface IProductRepository {
  findById(id: string): Promise<Product | undefined>;
  findByReference(reference: string): Promise<Product | undefined>;
  create(data: Prisma.ProductUncheckedCreateInput): Promise<Product>;
  save(product: Product): Promise<Product>;
  list(customerId: string): Promise<Product[]>;
  delete(id: string): Promise<void>;

  createPrice(
    productPrice: Prisma.ProductPriceUncheckedCreateInput,
  ): Promise<ProductPrice>;
  findPriceById(id: string): Promise<ProductPrice | undefined>;
  savePrice(productPrice: ProductPrice): Promise<ProductPrice>;
  deletePrice(id: string): Promise<void>;
  deletePrices(productId: string): Promise<void>;

  createTissue(
    productTissue: Prisma.ProductTissueUncheckedCreateInput,
  ): Promise<ProductTissue>;
  findTissueById(id: string): Promise<ProductTissue | undefined>;
  saveTissue(productTissue: ProductTissue): Promise<ProductTissue>;
  deleteTissue(id: string): Promise<void>;
  deleteTissues(productId: string): Promise<void>;
}
