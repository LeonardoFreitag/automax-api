import { injectable, inject } from 'tsyringe';
import IStockWithdrawalRepository from '@modules/stockWithdrawal/repositories/IStockWithdrawalRepository';

@injectable()
class DeleteStockWithdrawalItemService {
  constructor(
    @inject('StockWithdrawalRepository')
    private stockWithdrawalRepository: IStockWithdrawalRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.stockWithdrawalRepository.deleteItem(id);
  }
}

export default DeleteStockWithdrawalItemService;
