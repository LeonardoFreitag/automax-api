import { injectable, inject } from 'tsyringe';
import Sale from '@modules/sale/infra/typeorm/entities/Sale';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';

@injectable()
class ListSaleService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute(customerId: string): Promise<Sale[] | undefined> {
    const allSaleByidCustomer = await this.saleRepository.list(customerId);

    return allSaleByidCustomer;
  }
}

export default ListSaleService;
