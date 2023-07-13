import { injectable, inject } from 'tsyringe';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import { Sale } from '@prisma/client';

@injectable()
class ListSaleBySellerIdService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute(sellerId: string): Promise<Sale[] | undefined> {
    const allSaleByidCustomer = await this.saleRepository.listBySellerId(
      sellerId,
    );

    return allSaleByidCustomer;
  }
}

export default ListSaleBySellerIdService;
