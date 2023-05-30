import { injectable, inject } from 'tsyringe';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import { Sale } from '@prisma/client';

@injectable()
class ListSaleService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute(
    customerId: string,
    saleStatus: string,
  ): Promise<Sale[] | undefined> {
    const allSaleByidCustomer = await this.saleRepository.list(
      customerId,
      saleStatus,
    );

    return allSaleByidCustomer;
  }
}

export default ListSaleService;
