import IStockWithdrawalRepository from '@modules/stockWithdrawal/repositories/IStockWithdrawalRepository';
import {
  Prisma,
  StockWithdrawal,
  StockWithdrawalItems,
} from '@prisma/client';
import AppError from '@shared/errors/AppError';
import { prisma } from '@shared/infra/prisma/prisma';

class StockWithdrawalRepository implements IStockWithdrawalRepository {
  public async findById(id: string): Promise<StockWithdrawal | undefined> {
    const stockWithdrawal = await prisma.stockWithdrawal.findUnique({
      where: { id },
      include: {
        StockWithdrawalItems: true,
      },
    });

    return stockWithdrawal;
  }

  public async create(
    data: Prisma.StockWithdrawalUncheckedCreateInput,
  ): Promise<StockWithdrawal> {
    const stockWithdrawal = await prisma.stockWithdrawal.create({
      data,
    });

    return stockWithdrawal;
  }

  public async list(
    customerId: string,
    downloaded?: boolean,
  ): Promise<StockWithdrawal[]> {
    const stockWithdrawals = await prisma.stockWithdrawal.findMany({
      where: {
        customerId,
        ...(downloaded !== undefined && { downloaded }),
      },
      include: {
        StockWithdrawalItems: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return stockWithdrawals;
  }

  public async updateStatus(
    id: string,
    status: string,
  ): Promise<StockWithdrawal> {
    const foundStockWithdrawal = await this.findById(id);

    if (!foundStockWithdrawal) {
      throw new AppError('Stock withdrawal not found', 404);
    }

    const updatedStockWithdrawal = await prisma.stockWithdrawal.update({
      where: { id },
      data: { status },
    });

    return updatedStockWithdrawal;
  }

  public async changeDownloaded(
    id: string,
    downloaded: boolean,
  ): Promise<StockWithdrawal> {
    const foundStockWithdrawal = await this.findById(id);

    if (!foundStockWithdrawal) {
      throw new AppError('Stock withdrawal not found', 404);
    }

    const updatedStockWithdrawal = await prisma.stockWithdrawal.update({
      where: { id },
      data: { downloaded },
    });

    return updatedStockWithdrawal;
  }

  public async createItem(
    data: Prisma.StockWithdrawalItemsUncheckedCreateInput,
  ): Promise<StockWithdrawalItems> {
    const item = await prisma.stockWithdrawalItems.create({
      data,
    });

    return item;
  }

  public async listItems(
    stockWithdrawalId: string,
  ): Promise<StockWithdrawalItems[]> {
    const items = await prisma.stockWithdrawalItems.findMany({
      where: { stockWithdrawalId },
      orderBy: { createdAt: 'desc' },
    });

    return items;
  }

  public async findItemById(
    id: string,
  ): Promise<StockWithdrawalItems | undefined> {
    const item = await prisma.stockWithdrawalItems.findUnique({
      where: { id },
    });

    return item;
  }

  public async deleteItem(id: string): Promise<void> {
    const foundItem = await this.findItemById(id);

    if (!foundItem) {
      throw new AppError('Stock withdrawal item not found', 404);
    }

    await prisma.stockWithdrawalItems.delete({
      where: { id },
    });
  }
}

export default StockWithdrawalRepository;
