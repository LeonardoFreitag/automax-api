import { getRepository, Repository } from 'typeorm';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import Sale from '../entities/Sale';
import SaleItems from '../entities/SaleItems';
import SalePaymentForm from '../entities/SalePaymentForm';

class SaleRepository implements ISaleRepository {
  private ormRepository: Repository<Sale>;

  private ormSaleItems: Repository<SaleItems>;

  private ormSalePaymentForm: Repository<SalePaymentForm>;

  constructor() {
    this.ormRepository = getRepository(Sale);
    this.ormSaleItems = getRepository(SaleItems);
    this.ormSalePaymentForm = getRepository(SalePaymentForm);
  }

  public async findById(id: string): Promise<Sale | undefined> {
    const sale = this.ormRepository.findOne({
      where: { id },
    });

    return sale;
  }

  public async findBySaleNumber(saleNumber: string): Promise<Sale | undefined> {
    const sale = this.ormRepository.findOne({
      where: { saleNumber },
    });

    return sale;
  }

  public async findBySalerId(selerId: string): Promise<Sale | undefined> {
    const sale = this.ormRepository.findOne({
      where: { selerId },
    });

    return sale;
  }

  public async list(customerId: string): Promise<Sale[]> {
    const sales = this.ormRepository.find({
      where: {
        customerId,
      },
      join: {
        alias: 'Sale',
        leftJoinAndSelect: {
          contacts: 'Sale.items',
          paymentForm: 'Sale.paymentForm',
        },
      },
    });

    return sales;
  }

  public async create(saleData: Sale): Promise<Sale> {
    const sale = this.ormRepository.create(saleData);

    await this.ormRepository.save(sale);

    return sale;
  }

  public async save(sale: Sale): Promise<Sale> {
    return this.ormRepository.save(sale);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async deleteItems(saleId: string): Promise<void> {
    await this.ormSaleItems.delete({ saleId });
  }

  public async deletePaymentForm(saleId: string): Promise<void> {
    await this.ormSalePaymentForm.delete({ saleId });
  }
}

export default SaleRepository;
