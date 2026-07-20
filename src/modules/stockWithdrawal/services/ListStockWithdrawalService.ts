import { injectable, inject } from 'tsyringe';
import IStockWithdrawalRepository from '@modules/stockWithdrawal/repositories/IStockWithdrawalRepository';
import { StockWithdrawal } from '@prisma/client';

@injectable()
class ListStockWithdrawalService {
  constructor(
    @inject('StockWithdrawalRepository')
    private stockWithdrawalRepository: IStockWithdrawalRepository,
  ) {}

  public async execute(
    customerId: string,
    downloaded?: boolean,
  ): Promise<StockWithdrawal[]> {
    const stockWithdrawals = await this.stockWithdrawalRepository.list(
      customerId,
      downloaded,
    );

    return stockWithdrawals;
  }
}

export default ListStockWithdrawalService;
