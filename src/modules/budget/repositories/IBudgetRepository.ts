import {
  Prisma,
  Budget,
  BudgetItems,
  BudgetPaymentForm,
  Client,
  User,
} from '@prisma/client';

export type BudgetWithRelations = Budget & {
  BudgetItems: BudgetItems[];
  BudgetPaymentForm: BudgetPaymentForm[];
  Client: Client;
  Seller: User;
};

export default interface IBudgetRepository {
  findById(id: string): Promise<BudgetWithRelations | undefined>;
  listBySellerId(sellerId: string): Promise<Budget[]>;
  listBySellerIdAndMonth(
    sellerId: string,
    month: number,
    year: number,
  ): Promise<Budget[]>;
  findByBudgetNumber(BudgetNumber: string): Promise<Budget | undefined>;
  listBudgetsPaginated(
    sellerId: string,
    page: number,
    rows: number,
  ): Promise<Budget[]>;
  listBudgetsPaginatedByCompanyName(
    sellerId: string,
    companyName: string,
    page: number,
    rows: number,
  ): Promise<Budget[]>;
  create(dataProduct: Prisma.BudgetUncheckedCreateInput): Promise<Budget>;
  save(budget: Budget): Promise<Budget>;
  list(customerId: string, status: string): Promise<Budget[]>;
  delete(id: string): Promise<void>;

  createItems(
    dataItem: Prisma.BudgetItemsUncheckedCreateInput,
  ): Promise<BudgetItems>;
  findItemById(id: string): Promise<BudgetItems | undefined>;

  saveItem(budget: BudgetItems): Promise<BudgetItems>;
  deleteItem(id: string): Promise<void>;

  createPaymentForm(
    dataPaymentForm: Prisma.BudgetPaymentFormUncheckedCreateInput,
  ): Promise<BudgetPaymentForm>;
  findPaymentFormById(id: string): Promise<BudgetPaymentForm | undefined>;
  savePaymentForm(
    budgetPaymentForm: BudgetPaymentForm,
  ): Promise<BudgetPaymentForm>;
  deletePaymentForm(id: string): Promise<void>;
}
