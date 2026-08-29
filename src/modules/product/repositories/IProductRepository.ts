import { Prisma, Product, ProductPrice } from '@prisma/client';
import { PriceTableModel } from '@models/PriceTableModel';
import IListProductByPriceTableDTO from '@modules/product/dtos/IListProductByPriceTableDTO';

export interface IListProductByPriceTableResult {
  products: Product[];
  total: number;
}

export default interface IProductRepository {
  findById(id: string): Promise<Product | undefined>;
  findByProductCode(
    customerId: string,
    productCode: string,
  ): Promise<Product | undefined>;
  findByReference(
    customerId: string,
    reference: string,
  ): Promise<Product | undefined>;
  findByTablecode(
    customerId: string,
    productCode: string,
    tableCode: string,
    regionId: string,
  ): Promise<ProductPrice | undefined>;
  /**
   * Produtos inativos entre os ids informados. Devolve só os inativos porque
   * quem chama quer montar a mensagem de recusa — id que não existe mais não
   * entra aqui de propósito (ver assertProductsActive).
   */
  findInactiveByIds(ids: string[]): Promise<Product[]>;
  create(data: Prisma.ProductUncheckedCreateInput): Promise<Product>;
  save(product: Product): Promise<Product>;
  changeActivation(id: string, isActive: boolean): Promise<Product>;
  list(customerId: string, includeInactive?: boolean): Promise<Product[]>;
  listByGroupId(
    customerId: string,
    groupId: string,
    includeInactive?: boolean,
  ): Promise<Product[]>;
  listPriceTables(
    customerId: string,
    regionId: string,
    includeInactive?: boolean,
  ): Promise<PriceTableModel[]>;
  listByPriceTable(
    data: IListProductByPriceTableDTO,
  ): Promise<IListProductByPriceTableResult>;
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
