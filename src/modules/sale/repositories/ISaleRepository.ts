import { Prisma, Sale, SaleItems, SalePaymentForm } from '@prisma/client';

export default interface ISaleRepository {
  findById(id: string): Promise<Sale | undefined>;
  listBySellerId(sellerId: string): Promise<Sale[]>;
  findBySaleNumber(saleNumber: string): Promise<Sale | undefined>;
  create(dataProduct: Prisma.SaleUncheckedCreateInput): Promise<Sale>;
  save(sale: Sale): Promise<Sale>;
  list(customerId: string, status: string): Promise<Sale[]>;
  delete(id: string): Promise<void>;

  createItems(
    dataItem: Prisma.SaleItemsUncheckedCreateInput,
  ): Promise<SaleItems>;
  findItemById(id: string): Promise<SaleItems | undefined>;

  saveItem(sale: SaleItems): Promise<SaleItems>;
  deleteItem(id: string): Promise<void>;

  createPaymentForm(
    dataPaymentForm: Prisma.SalePaymentFormUncheckedCreateInput,
  ): Promise<SalePaymentForm>;
  findPaymentFormById(id: string): Promise<SalePaymentForm | undefined>;
  savePaymentForm(salePaymentForm: SalePaymentForm): Promise<SalePaymentForm>;
  deletePaymentForm(id: string): Promise<void>;
}
