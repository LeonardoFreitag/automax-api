import { injectable, inject } from 'tsyringe';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import { Sale } from '@prisma/client';

@injectable()
class ListSalesPaginetedService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute(
    sellerId: string,
    page: number,
    rows: number,
  ): Promise<Sale[] | undefined> {
    const saleList = await this.saleRepository.listSalesPaginated(
      sellerId,
      page,
      rows,
    );

    return saleList;
  }
}

export default ListSalesPaginetedService;
