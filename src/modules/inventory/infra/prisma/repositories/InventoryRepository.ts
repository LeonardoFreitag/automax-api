import IInventoryRepository from '@modules/inventory/repositories/IInventoryRepository';
import { Prisma, Inventory, InventoryItems } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import { prisma } from '@shared/infra/prisma/prisma';

class InventoryRepository implements IInventoryRepository {
  public async findById(id: string): Promise<Inventory | undefined> {
    const inventory = await prisma.inventory.findUnique({
      where: { id },
      include: {
        InventoryItems: true,
      },
    });

    return inventory;
  }

  public async create(
    data: Prisma.InventoryUncheckedCreateInput,
  ): Promise<Inventory> {
    const inventory = await prisma.inventory.create({
      data,
    });

    return inventory;
  }

  public async list(
    customerId: string,
    downloaded?: boolean,
  ): Promise<Inventory[]> {
    const inventories = await prisma.inventory.findMany({
      where: {
        customerId,
        ...(downloaded !== undefined && { downloaded }),
      },
      include: {
        InventoryItems: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return inventories;
  }

  public async updateStatus(id: string, status: string): Promise<Inventory> {
    const foundInventory = await this.findById(id);

    if (!foundInventory) {
      throw new AppError('Inventory not found', 404);
    }

    const updatedInventory = await prisma.inventory.update({
      where: { id },
      data: { status },
    });

    return updatedInventory;
  }

  public async changeDownloaded(
    id: string,
    downloaded: boolean,
  ): Promise<Inventory> {
    const foundInventory = await this.findById(id);

    if (!foundInventory) {
      throw new AppError('Inventory not found', 404);
    }

    const updatedInventory = await prisma.inventory.update({
      where: { id },
      data: { downloaded },
    });

    return updatedInventory;
  }

  public async createItem(
    data: Prisma.InventoryItemsUncheckedCreateInput,
  ): Promise<InventoryItems> {
    const item = await prisma.inventoryItems.create({
      data,
    });

    return item;
  }

  public async listItems(inventoryId: string): Promise<InventoryItems[]> {
    const items = await prisma.inventoryItems.findMany({
      where: { inventoryId },
      orderBy: { createdAt: 'desc' },
    });

    return items;
  }

  public async findItemById(id: string): Promise<InventoryItems | undefined> {
    const item = await prisma.inventoryItems.findUnique({
      where: { id },
    });

    return item;
  }

  public async deleteItem(id: string): Promise<void> {
    const foundItem = await this.findItemById(id);

    if (!foundItem) {
      throw new AppError('Inventory item not found', 404);
    }

    await prisma.inventoryItems.delete({
      where: { id },
    });
  }
}

export default InventoryRepository;
