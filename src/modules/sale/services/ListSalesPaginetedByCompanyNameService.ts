import { injectable, inject } from 'tsyringe';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import { Sale } from '@prisma/client';

@injectable()
class ListSalesPaginetedCompanyNameService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute(
    sellerId: string,
    companyName: string,
    page: number,
    rows: number,
  ): Promise<Sale[] | undefined> {
    const saleList = await this.saleRepository.listSalesPaginatedByCompanyName(
      sellerId,
      companyName,
      page,
      rows,
    );

    return saleList;
  }
}

export default ListSalesPaginetedCompanyNameService;
