import { injectable, inject } from 'tsyringe';
import IStockWithdrawalRepository from '@modules/stockWithdrawal/repositories/IStockWithdrawalRepository';
import { StockWithdrawal } from '@prisma/client';

interface IRequest {
  customerId: string;
  userId: string;
  userName: string;
  notes?: string;
}

@injectable()
class CreateStockWithdrawalService {
  constructor(
    @inject('StockWithdrawalRepository')
    private stockWithdrawalRepository: IStockWithdrawalRepository,
  ) {}

  public async execute({
    customerId,
    userId,
    userName,
    notes,
  }: IRequest): Promise<StockWithdrawal> {
    const stockWithdrawal = await this.stockWithdrawalRepository.create({
      customerId,
      userId,
      userName,
      notes,
      status: 'em_andamento',
      downloaded: false,
    });

    return stockWithdrawal;
  }
}

export default CreateStockWithdrawalService;
