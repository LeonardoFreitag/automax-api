import {
  Prisma,
  StockWithdrawal,
  StockWithdrawalItems,
} from '@prisma/client';

export default interface IStockWithdrawalRepository {
  findById(id: string): Promise<StockWithdrawal | undefined>;
  create(
    data: Prisma.StockWithdrawalUncheckedCreateInput,
  ): Promise<StockWithdrawal>;
  list(customerId: string, downloaded?: boolean): Promise<StockWithdrawal[]>;
  updateStatus(id: string, status: string): Promise<StockWithdrawal>;
  changeDownloaded(id: string, downloaded: boolean): Promise<StockWithdrawal>;

  createItem(
    data: Prisma.StockWithdrawalItemsUncheckedCreateInput,
  ): Promise<StockWithdrawalItems>;
  listItems(stockWithdrawalId: string): Promise<StockWithdrawalItems[]>;
  findItemById(id: string): Promise<StockWithdrawalItems | undefined>;
  deleteItem(id: string): Promise<void>;
}
