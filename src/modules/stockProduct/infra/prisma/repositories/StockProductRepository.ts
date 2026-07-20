import IStockProductRepository from '@modules/stockProduct/repositories/IStockProductRepository';
import { Prisma, StockProduct } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import { prisma } from '@shared/infra/prisma/prisma';

class StockProductRepository implements IStockProductRepository {
  public async findById(id: string): Promise<StockProduct | undefined> {
    const stockProduct = await prisma.stockProduct.findUnique({
      where: { id },
    });

    return stockProduct;
  }

  public async findByCode(
    customerId: string,
    code: string,
  ): Promise<StockProduct | undefined> {
    const stockProduct = await prisma.stockProduct.findFirst({
      where: {
        customerId,
        code,
      },
    });

    return stockProduct;
  }

  public async findByReference(
    customerId: string,
    reference: string,
  ): Promise<StockProduct | undefined> {
    const stockProduct = await prisma.stockProduct.findFirst({
      where: {
        customerId,
        reference,
      },
    });

    return stockProduct;
  }

  public async list(customerId: string): Promise<StockProduct[]> {
    const stockProducts = await prisma.stockProduct.findMany({
      where: {
        customerId,
      },
      orderBy: {
        description: 'asc',
      },
    });

    return stockProducts;
  }

  public async search(
    customerId: string,
    search: string,
  ): Promise<StockProduct[]> {
    const stockProducts = await prisma.stockProduct.findMany({
      where: {
        customerId,
        OR: [
          { code: { contains: search } },
          { reference: { contains: search } },
          { description: { contains: search } },
        ],
      },
      orderBy: {
        description: 'asc',
      },
      take: 50,
    });

    return stockProducts;
  }

  public async create(
    data: Prisma.StockProductUncheckedCreateInput,
  ): Promise<StockProduct> {
    const stockProduct = await prisma.stockProduct.create({
      data,
    });

    return stockProduct;
  }

  public async save(stockProduct: StockProduct): Promise<StockProduct> {
    const updatedStockProduct = await prisma.stockProduct.update({
      where: {
        id: stockProduct.id,
      },
      data: {
        code: stockProduct.code,
        reference: stockProduct.reference,
        description: stockProduct.description,
        unity: stockProduct.unity,
      },
    });

    return updatedStockProduct;
  }

  public async delete(id: string): Promise<void> {
    const foundStockProduct = await prisma.stockProduct.findUnique({
      where: { id },
    });

    if (!foundStockProduct) {
      throw new AppError('Stock product not found', 404);
    }

    await prisma.stockProduct.delete({
      where: {
        id,
      },
    });
  }
}

export default StockProductRepository;
