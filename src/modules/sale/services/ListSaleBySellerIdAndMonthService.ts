import { injectable, inject } from 'tsyringe';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import { Sale } from '@prisma/client';

@injectable()
class ListSaleBySellerIdAndMonthService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute(
    sellerId: string,
    month: number,
    year: number,
  ): Promise<Sale[] | undefined> {
    const allSaleByidCustomer =
      await this.saleRepository.listBySellerIdAndMonth(sellerId, month, year);

    return allSaleByidCustomer;
  }
}

export default ListSaleBySellerIdAndMonthService;
