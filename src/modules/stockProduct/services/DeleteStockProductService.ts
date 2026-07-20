import { injectable, inject } from 'tsyringe';
import IStockProductRepository from '@modules/stockProduct/repositories/IStockProductRepository';

@injectable()
class DeleteStockProductService {
  constructor(
    @inject('StockProductRepository')
    private stockProductRepository: IStockProductRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.stockProductRepository.delete(id);
  }
}

export default DeleteStockProductService;
