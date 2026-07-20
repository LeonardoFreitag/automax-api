import { Prisma, Inventory, InventoryItems } from '@prisma/client';

export default interface IInventoryRepository {
  findById(id: string): Promise<Inventory | undefined>;
  create(data: Prisma.InventoryUncheckedCreateInput): Promise<Inventory>;
  list(customerId: string, downloaded?: boolean): Promise<Inventory[]>;
  updateStatus(id: string, status: string): Promise<Inventory>;
  changeDownloaded(id: string, downloaded: boolean): Promise<Inventory>;

  createItem(
    data: Prisma.InventoryItemsUncheckedCreateInput,
  ): Promise<InventoryItems>;
  listItems(inventoryId: string): Promise<InventoryItems[]>;
  findItemById(id: string): Promise<InventoryItems | undefined>;
  deleteItem(id: string): Promise<void>;
}
