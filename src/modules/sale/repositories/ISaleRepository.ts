import { ICreateSaleDTO } from '../dtos/ICreateSaleDTO';
import Sale from '../infra/typeorm/entities/Sale';

export default interface ISaleRepository {
  findById(id: string): Promise<Sale | undefined>;
  findBySalerId(salerId: string): Promise<Sale | undefined>;
  findBySaleNumber(saleNumber: string): Promise<Sale | undefined>;
  create(data: ICreateSaleDTO): Promise<Sale>;
  save(sale: Sale): Promise<Sale>;
  list(customerId: string): Promise<Sale[]>;
  delete(id: string): Promise<void>;
  deleteItems(saleId: string): Promise<void>;
  deletePaymentForm(saleId: string): Promise<void>;
}
