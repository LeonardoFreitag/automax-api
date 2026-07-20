import { Prisma, StockProduct } from '@prisma/client';

export default interface IStockProductRepository {
  findById(id: string): Promise<StockProduct | undefined>;
  findByCode(
    customerId: string,
    code: string,
  ): Promise<StockProduct | undefined>;
  findByReference(
    customerId: string,
    reference: string,
  ): Promise<StockProduct | undefined>;
  create(data: Prisma.StockProductUncheckedCreateInput): Promise<StockProduct>;
  save(stockProduct: StockProduct): Promise<StockProduct>;
  list(customerId: string): Promise<StockProduct[]>;
  search(customerId: string, search: string): Promise<StockProduct[]>;
  delete(id: string): Promise<void>;
}
