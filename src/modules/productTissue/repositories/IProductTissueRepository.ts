import { Prisma, ProductTissue } from '@prisma/client';

export default interface IProductTissueRepository {
  createTissue(
    productTissue: Prisma.ProductTissueUncheckedCreateInput,
  ): Promise<ProductTissue>;
  findTissueById(id: string): Promise<ProductTissue | undefined>;
  findTissueByCode(
    code: string,
    customerId: string,
  ): Promise<ProductTissue | undefined>;
  listTissuesByProductPrice(
    productPriceId: string,
    customerId: string,
  ): Promise<ProductTissue[]>;
  listTissuesByCustomerId(customerId: string): Promise<ProductTissue[]>;
  saveTissue(productTissue: ProductTissue): Promise<ProductTissue>;
  deleteTissue(id: string): Promise<void>;
  deleteTissuesByProductPrice(productPriceId: string): Promise<void>;
  deleteTissuesByCustomerId(customerId: string): Promise<void>;
}
