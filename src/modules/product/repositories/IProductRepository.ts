import { Prisma, Product, ProductPrice, ProductTissue } from '@prisma/client';

export default interface IProductRepository {
  findById(id: string): Promise<Product | undefined>;
  findByReference(reference: string): Promise<Product | undefined>;
  findByTablecode(
    customerId: string,
    productCode: string,
    tableCode: string,
    regionId: string,
  ): Promise<ProductPrice | undefined>;
  create(data: Prisma.ProductUncheckedCreateInput): Promise<Product>;
  save(product: Product): Promise<Product>;
  list(customerId: string): Promise<Product[]>;
  listByGroupId(customerId: string, groupId: string): Promise<Product[]>;
  delete(id: string): Promise<void>;

  createPrice(
    productPrice: Prisma.ProductPriceUncheckedCreateInput,
  ): Promise<ProductPrice>;
  createManyPrice(
    productPrice: Prisma.ProductPriceUncheckedCreateInput[],
  ): Promise<void>;
  findPriceById(id: string): Promise<ProductPrice | undefined>;
  savePrice(productPrice: ProductPrice): Promise<ProductPrice>;
  deletePrice(id: string): Promise<void>;
  deletePrices(productId: string): Promise<void>;
}
