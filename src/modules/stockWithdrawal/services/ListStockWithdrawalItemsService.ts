import { injectable, inject } from 'tsyringe';
import IStockWithdrawalRepository from '@modules/stockWithdrawal/repositories/IStockWithdrawalRepository';
import { StockWithdrawalItems } from '@prisma/client';

@injectable()
class ListStockWithdrawalItemsService {
  constructor(
    @inject('StockWithdrawalRepository')
    private stockWithdrawalRepository: IStockWithdrawalRepository,
  ) {}

  public async execute(
    stockWithdrawalId: string,
  ): Promise<StockWithdrawalItems[]> {
    const items = await this.stockWithdrawalRepository.listItems(
      stockWithdrawalId,
    );

    return items;
  }
}

export default ListStockWithdrawalItemsService;
