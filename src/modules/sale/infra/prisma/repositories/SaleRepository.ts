import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import { Prisma, Sale, SaleItems, SalePaymentForm } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import { prisma } from '@shared/infra/prisma/prisma';

class SaleRepository implements ISaleRepository {
  listSalesPaginatedByCompanyName(
    sellerId: string,
    companyName: string,
    page: number,
    rows: number,
  ): Promise<Sale[]> {
    const sales = prisma.sale.findMany({
      where: {
        sellerId,
        Client: {
          companyName: {
            contains: companyName,
          },
        },
      },
      include: {
        SaleItems: true,
        SalePaymentForm: true,
        Client: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: rows,
      skip: (page - 1) * 10,
    });

    return sales;
  }

  public async listSalesPaginated(
    sellerId: string,
    page: number,
    rows: number,
  ): Promise<Sale[]> {
    const sales = await prisma.sale.findMany({
      where: {
        sellerId,
      },
      include: {
        SaleItems: true,
        SalePaymentForm: true,
        Client: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: rows,
      skip: (page - 1) * 10,
    });

    return sales;
  }

  public async listBySellerIdAndMonth(
    sellerId: string,
    month: number,
    year: number,
  ): Promise<Sale[]> {
    const sales = await prisma.sale.findMany({
      where: {
        sellerId,
        saleDate: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
      include: {
        SaleItems: true,
        SalePaymentForm: true,
        Client: true,
      },
    });

    return sales;
  }

  public async findItemById(id: string): Promise<SaleItems> {
    const foundItem = await prisma.saleItems.findUnique({
      where: {
        id,
      },
    });
    return foundItem;
  }

  public async findPaymentFormById(id: string): Promise<SalePaymentForm> {
    const foundPaymentForm = await prisma.salePaymentForm.findUnique({
      where: {
        id,
      },
    });

    return foundPaymentForm;
  }

  public async createItems(
    dataItems: Prisma.SaleItemsUncheckedCreateInput,
  ): Promise<SaleItems> {
    const newSaleItem = await prisma.saleItems.create({
      data: dataItems,
    });
    return newSaleItem;
  }

  public async saveItem(sale: SaleItems): Promise<SaleItems> {
    const updatedSaleItem = await prisma.saleItems.update({
      where: {
        id: sale.id,
      },
      data: {
        productId: sale.productId,
        code: sale.code,
        reference: sale.reference,
        description: sale.description,
        unity: sale.unity,
        tableId: sale.tableId,
        tableCode: sale.tableCode,
        tableName: sale.tableName,
        price: sale.price,
        quantity: sale.quantity,
        amount: sale.amount,
        notes: sale.notes,
        originalPrice: sale.originalPrice,
        groupId: sale.groupId,
        groupName: sale.groupName,
        tissueId: sale.tissueId,
        tissueCode: sale.tissueCode,
        tissueName: sale.tissueName,
        underMeasure: sale.underMeasure,
        widthSale: sale.widthSale,
      },
    });
    return updatedSaleItem;
  }

  public async deleteItem(id: string): Promise<void> {
    const foundItem = await prisma.saleItems.findUnique({
      where: {
        id,
      },
    });

    if (!foundItem) {
      throw new AppError('Item not found!', 404);
    }

    await prisma.saleItems.delete({
      where: {
        id,
      },
    });
  }

  public async createPaymentForm(
    dataPaymentForm: Prisma.SalePaymentFormUncheckedCreateInput,
  ): Promise<SalePaymentForm> {
    const newPaymentForm = await prisma.salePaymentForm.create({
      data: dataPaymentForm,
    });
    return newPaymentForm;
  }

  public async savePaymentForm(
    salePaymentForm: SalePaymentForm,
  ): Promise<SalePaymentForm> {
    const updatedPaymentForm = await prisma.salePaymentForm.update({
      where: {
        id: salePaymentForm.id,
      },
      data: {
        paymentFormId: salePaymentForm.paymentFormId,
        description: salePaymentForm.description,
        amount: salePaymentForm.amount,
        installments: salePaymentForm.installments,
      },
    });
    return updatedPaymentForm;
  }

  public async deletePaymentForm(id: string): Promise<void> {
    const foundPaymentForm = await prisma.salePaymentForm.findUnique({
      where: {
        id,
      },
    });

    if (!foundPaymentForm) {
      throw new AppError('Payment Form not found!', 404);
    }

    await prisma.salePaymentForm.delete({
      where: {
        id,
      },
    });
  }

  public async findById(id: string): Promise<Sale | undefined> {
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        SaleItems: true,
        SalePaymentForm: true,
      },
    });

    return sale;
  }

  public async findBySaleNumber(saleNumber: string): Promise<Sale | undefined> {
    const sale = await prisma.sale.findFirst({
      where: { saleNumber },
      include: {
        SaleItems: true,
        SalePaymentForm: true,
      },
    });

    return sale;
  }

  public async listBySellerId(sellerId: string): Promise<Sale[]> {
    const sale = await prisma.sale.findMany({
      where: { sellerId },
      include: {
        SaleItems: true,
        SalePaymentForm: true,
        Client: true,
      },
    });

    return sale;
  }

  public async list(customerId: string, status: string): Promise<Sale[]> {
    const sales = await prisma.sale.findMany({
      where: {
        customerId,
        saleStatus: status,
      },
      include: {
        SaleItems: true,
        SalePaymentForm: true,
        Client: true,
      },
    });

    return sales;
  }

  public async create(
    saleData: Prisma.SaleUncheckedCreateInput,
  ): Promise<Sale> {
    const sale = await prisma.sale.create({
      data: {
        ...saleData,
        SaleItems: {
          createMany: {
            data: saleData.SaleItems as Prisma.SaleItemsUncheckedCreateInput,
          },
        },
        SalePaymentForm: {
          createMany: {
            data: saleData.SalePaymentForm as Prisma.SalePaymentFormUncheckedCreateInput,
          },
        },
      },
    });

    const saleCreated = await prisma.sale.findUnique({
      where: {
        id: sale.id,
      },
      include: {
        SaleItems: true,
        SalePaymentForm: true,
      },
    });

    return saleCreated;
  }

  public async save(sale: Sale): Promise<Sale> {
    const updatedSale = await prisma.sale.update({
      where: {
        id: sale.id,
      },
      data: {
        saleNumber: sale.saleNumber,
        clientId: sale.clientId,
        amount: sale.amount,
        discount: sale.discount,
        increment: sale.increment,
        total: sale.total,
        notes: sale.notes,
        saleStatus: sale.saleStatus,
        refusedNotes: sale.refusedNotes,
        returnedNotes: sale.returnedNotes,
        signatureFileName: sale.signatureFileName,
        signatureUrl: sale.signatureUrl,
        signatureBase64: sale.signatureBase64,
      },
    });
    return updatedSale;
  }

  public async delete(id: string): Promise<void> {
    const foundSale = await prisma.sale.findUnique({
      where: {
        id,
      },
    });

    if (!foundSale) {
      throw new AppError('Sale not found!', 404);
    }

    await prisma.sale.delete({
      where: {
        id,
      },
    });
  }
}

export default SaleRepository;
