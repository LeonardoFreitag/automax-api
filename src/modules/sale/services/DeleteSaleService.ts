import { injectable, inject } from 'tsyringe';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';

@injectable()
class DeleteSaleService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.saleRepository.delete(id);
  }
}

export default DeleteSaleService;
