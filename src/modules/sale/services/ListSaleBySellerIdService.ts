import { injectable, inject } from 'tsyringe';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import { SaleWithRelations } from '../infra/prisma/repositories/SaleRepository';

@injectable()
class ListSaleBySellerIdService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute(sellerId: string): Promise<SaleWithRelations[]> {
    const allSaleByidCustomer = await this.saleRepository.listBySellerId(
      sellerId,
    );

    return allSaleByidCustomer;
  }
}

export default ListSaleBySellerIdService;
