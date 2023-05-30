import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import { Prisma, Sale, SaleItems, SalePaymentForm } from '@prisma/client';
import { prisma } from '@shared/infra/prisma/prisma';

class SaleRepository implements ISaleRepository {
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
        price: sale.price,
        quantity: sale.quantity,
        amount: sale.amount,
        notes: sale.notes,
        originalPrice: sale.originalPrice,
        groupId: sale.groupId,
        tissueId: sale.tissueId,
        underMeasure: sale.underMeasure,
        widthSale: sale.widthSale,
      },
    });
    return updatedSaleItem;
  }

  public async deleteItem(id: string): Promise<void> {
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
        descripriont: salePaymentForm.descripriont,
        amount: salePaymentForm.amount,
        installments: salePaymentForm.installments,
      },
    });
    return updatedPaymentForm;
  }

  public async deletePaymentForm(id: string): Promise<void> {
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

  public async findBySalerId(selerId: string): Promise<Sale | undefined> {
    const sale = await prisma.sale.findFirst({
      where: { selerId },
      include: {
        SaleItems: true,
        SalePaymentForm: true,
      },
    });

    return sale;
  }

  public async list(customerId: string): Promise<Sale[]> {
    const sales = await prisma.sale.findMany({
      where: {
        customerId,
      },
      include: {
        SaleItems: true,
        SalePaymentForm: true,
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

    return sale;
  }

  public async save(sale: Sale): Promise<Sale> {
    const updatedSale = await prisma.sale.update({
      where: {
        id: sale.id,
      },
      data: {
        clientId: sale.clientId,
        amount: sale.amount,
        discount: sale.discount,
        total: sale.total,
        notes: sale.notes,
        finished: sale.finished,
        sent: sale.sent,
        refused: sale.refused,
        refusedNotes: sale.refusedNotes,
        returned: sale.returned,
        returnedNotes: sale.returnedNotes,
        signatureFileName: sale.signatureFileName,
        signatureUrl: sale.signatureUrl,
        signatureBase64: sale.signatureBase64,
        accepted: sale.accepted,
      },
    });
    return updatedSale;
  }

  public async delete(id: string): Promise<void> {
    await prisma.sale.delete({
      where: {
        id,
      },
    });
  }
}

export default SaleRepository;
