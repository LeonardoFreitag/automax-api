import { injectable, inject } from 'tsyringe';
import IStockWithdrawalRepository from '@modules/stockWithdrawal/repositories/IStockWithdrawalRepository';
import { StockWithdrawal } from '@prisma/client';

@injectable()
class ChangeStockWithdrawalDownloadedService {
  constructor(
    @inject('StockWithdrawalRepository')
    private stockWithdrawalRepository: IStockWithdrawalRepository,
  ) {}

  // chamado pelo ERP depois de gravar a baixa no Firebird e dar baixa no estoque
  public async execute(
    id: string,
    downloaded: boolean,
  ): Promise<StockWithdrawal> {
    const stockWithdrawal = await this.stockWithdrawalRepository.changeDownloaded(
      id,
      downloaded,
    );

    return stockWithdrawal;
  }
}

export default ChangeStockWithdrawalDownloadedService;
