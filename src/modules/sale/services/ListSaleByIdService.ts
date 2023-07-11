import { injectable, inject } from 'tsyringe';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import { Sale } from '@prisma/client';

@injectable()
class ListSaleByIdService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute(id: string): Promise<Sale | undefined> {
    const allSaleByidCustomer = await this.saleRepository.findById(id);

    return allSaleByidCustomer;
  }
}

export default ListSaleByIdService;
