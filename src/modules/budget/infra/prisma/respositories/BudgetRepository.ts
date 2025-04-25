import IBudgetRepository, {
  BudgetWithRelations,
} from '@modules/budget/repositories/IBudgetRepository';
import { Prisma, Budget, BudgetItems, BudgetPaymentForm } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import { prisma } from '@shared/infra/prisma/prisma';

class BudgetRepository implements IBudgetRepository {
  listBudgetsPaginatedByCompanyName(
    sellerId: string,
    companyName: string,
    page: number,
    rows: number,
  ): Promise<Budget[]> {
    const Budgets = prisma.budget.findMany({
      where: {
        sellerId,
        Client: {
          companyName: {
            contains: companyName,
          },
        },
      },
      include: {
        BudgetItems: true,
        BudgetPaymentForm: true,
        Client: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: rows,
      skip: (page - 1) * 10,
    });

    return Budgets;
  }

  public async listBudgetsPaginated(
    sellerId: string,
    page: number,
    rows: number,
  ): Promise<Budget[]> {
    const Budgets = await prisma.budget.findMany({
      where: {
        sellerId,
      },
      include: {
        BudgetItems: true,
        BudgetPaymentForm: true,
        Client: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: rows,
      skip: (page - 1) * 10,
    });

    return Budgets;
  }

  public async listBySellerIdAndMonth(
    sellerId: string,
    month: number,
    year: number,
  ): Promise<Budget[]> {
    const Budgets = await prisma.budget.findMany({
      where: {
        sellerId,
        budgetDate: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
      include: {
        BudgetItems: true,
        BudgetPaymentForm: true,
        Client: true,
      },
    });

    return Budgets;
  }

  public async findItemById(id: string): Promise<BudgetItems> {
    const foundItem = await prisma.budgetItems.findUnique({
      where: {
        id,
      },
    });
    return foundItem;
  }

  public async findPaymentFormById(id: string): Promise<BudgetPaymentForm> {
    const foundPaymentForm = await prisma.budgetPaymentForm.findUnique({
      where: {
        id,
      },
    });

    return foundPaymentForm;
  }

  public async createItems(
    dataItems: Prisma.BudgetItemsUncheckedCreateInput,
  ): Promise<BudgetItems> {
    const newBudgetItem = await prisma.budgetItems.create({
      data: dataItems,
    });
    return newBudgetItem;
  }

  public async saveItem(budget: BudgetItems): Promise<BudgetItems> {
    const updatedBudgetItem = await prisma.budgetItems.update({
      where: {
        id: budget.id,
      },
      data: {
        productId: budget.productId,
        code: budget.code,
        reference: budget.reference,
        description: budget.description,
        unity: budget.unity,
        tableId: budget.tableId,
        tableCode: budget.tableCode,
        tableName: budget.tableName,
        price: budget.price,
        quantity: budget.quantity,
        amount: budget.amount,
        notes: budget.notes,
        originalPrice: budget.originalPrice,
        groupId: budget.groupId,
        groupName: budget.groupName,
        tissueId: budget.tissueId,
        tissueCode: budget.tissueCode,
        tissueName: budget.tissueName,
        underMeasure: budget.underMeasure,
        widthSale: budget.widthSale,
      },
    });
    return updatedBudgetItem;
  }

  public async deleteItem(id: string): Promise<void> {
    const foundItem = await prisma.budgetItems.findUnique({
      where: {
        id,
      },
    });

    if (!foundItem) {
      throw new AppError('Item not found!', 404);
    }

    await prisma.budgetItems.delete({
      where: {
        id,
      },
    });
  }

  public async createPaymentForm(
    dataPaymentForm: Prisma.BudgetPaymentFormUncheckedCreateInput,
  ): Promise<BudgetPaymentForm> {
    const newPaymentForm = await prisma.budgetPaymentForm.create({
      data: dataPaymentForm,
    });
    return newPaymentForm;
  }

  public async savePaymentForm(
    budgetPaymentForm: BudgetPaymentForm,
  ): Promise<BudgetPaymentForm> {
    const updatedPaymentForm = await prisma.budgetPaymentForm.update({
      where: {
        id: budgetPaymentForm.id,
      },
      data: {
        paymentFormId: budgetPaymentForm.paymentFormId,
        description: budgetPaymentForm.description,
        amount: budgetPaymentForm.amount,
        installments: budgetPaymentForm.installments,
      },
    });
    return updatedPaymentForm;
  }

  public async deletePaymentForm(id: string): Promise<void> {
    const foundPaymentForm = await prisma.budgetPaymentForm.findUnique({
      where: {
        id,
      },
    });

    if (!foundPaymentForm) {
      throw new AppError('Payment Form not found!', 404);
    }

    await prisma.budgetPaymentForm.delete({
      where: {
        id,
      },
    });
  }

  public async findById(id: string): Promise<BudgetWithRelations | undefined> {
    const budget = await prisma.budget.findUnique({
      where: { id },
      include: {
        Client: true,
        BudgetItems: true,
        BudgetPaymentForm: true,
        Seller: true,
      },
    });

    return budget;
  }

  public async findByBudgetNumber(
    budgetNumber: string,
  ): Promise<Budget | undefined> {
    const budget = await prisma.budget.findFirst({
      where: { budgetNumber },
      include: {
        BudgetItems: true,
        BudgetPaymentForm: true,
      },
    });

    return budget;
  }

  public async listBySellerId(sellerId: string): Promise<Budget[]> {
    const budget = await prisma.budget.findMany({
      where: { sellerId },
      include: {
        BudgetItems: true,
        BudgetPaymentForm: true,
        Client: true,
      },
    });

    return budget;
  }

  public async list(customerId: string, status: string): Promise<Budget[]> {
    const Budgets = await prisma.budget.findMany({
      where: {
        customerId,
        budgetStatus: status,
      },
      include: {
        BudgetItems: true,
        BudgetPaymentForm: true,
        Client: true,
      },
    });

    return Budgets;
  }

  public async create(
    BudgetData: Prisma.BudgetUncheckedCreateInput,
  ): Promise<Budget> {
    // console.log(BudgetData);
    const budget = await prisma.budget.create({
      data: {
        ...BudgetData,
        budgetStatus: 'waiting',
        BudgetItems: {
          createMany: {
            data: BudgetData.BudgetItems as Prisma.BudgetItemsUncheckedCreateInput,
          },
        },
        BudgetPaymentForm: {
          createMany: {
            data: BudgetData.BudgetPaymentForm as Prisma.BudgetPaymentFormUncheckedCreateInput,
          },
        },
      },
    });

    const budgetCreated = await prisma.budget.findUnique({
      where: {
        id: budget.id,
      },
      include: {
        BudgetItems: true,
        BudgetPaymentForm: true,
      },
    });

    return budgetCreated;
  }

  public async save(budget: Budget): Promise<Budget> {
    const updatedBudget = await prisma.budget.update({
      where: {
        id: budget.id,
      },
      data: {
        budgetNumber: budget.budgetNumber,
        clientId: budget.clientId,
        amount: budget.amount,
        discount: budget.discount,
        increment: budget.increment,
        total: budget.total,
        notes: budget.notes,
        budgetStatus: budget.budgetStatus,
        refusedNotes: budget.refusedNotes,
        returnedNotes: budget.returnedNotes,
        budgetFileName: budget.budgetFileName,
        budgetFileUrl: budget.budgetFileUrl,
        budgetDate: budget.budgetDate,
      },
    });
    return updatedBudget;
  }

  public async delete(id: string): Promise<void> {
    const foundBudget = await prisma.budget.findUnique({
      where: {
        id,
      },
    });

    if (!foundBudget) {
      throw new AppError('Budget not found!', 404);
    }

    await prisma.budget.delete({
      where: {
        id,
      },
    });
  }
}

export default BudgetRepository;
