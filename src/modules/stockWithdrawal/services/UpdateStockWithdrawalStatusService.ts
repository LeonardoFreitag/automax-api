import { injectable, inject } from 'tsyringe';
import IStockWithdrawalRepository from '@modules/stockWithdrawal/repositories/IStockWithdrawalRepository';
import { StockWithdrawal } from '@prisma/client';

@injectable()
class UpdateStockWithdrawalStatusService {
  constructor(
    @inject('StockWithdrawalRepository')
    private stockWithdrawalRepository: IStockWithdrawalRepository,
  ) {}

  // status: "em_andamento" | "finalizado"
  public async execute(id: string, status: string): Promise<StockWithdrawal> {
    const stockWithdrawal = await this.stockWithdrawalRepository.updateStatus(
      id,
      status,
    );

    return stockWithdrawal;
  }
}

export default UpdateStockWithdrawalStatusService;
