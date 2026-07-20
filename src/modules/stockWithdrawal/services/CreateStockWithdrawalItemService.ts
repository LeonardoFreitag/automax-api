import { injectable, inject } from 'tsyringe';
import IStockWithdrawalRepository from '@modules/stockWithdrawal/repositories/IStockWithdrawalRepository';
import { StockWithdrawalItems } from '@prisma/client';
import AppError from '@shared/errors/AppError';

interface IRequest {
  stockWithdrawalId: string;
  stockProductId: string;
  code: string;
  reference: string;
  description: string;
  unity: string;
  quantity: number;
}

@injectable()
class CreateStockWithdrawalItemService {
  constructor(
    @inject('StockWithdrawalRepository')
    private stockWithdrawalRepository: IStockWithdrawalRepository,
  ) {}

  public async execute({
    stockWithdrawalId,
    stockProductId,
    code,
    reference,
    description,
    unity,
    quantity,
  }: IRequest): Promise<StockWithdrawalItems> {
    const stockWithdrawal = await this.stockWithdrawalRepository.findById(
      stockWithdrawalId,
    );

    if (!stockWithdrawal) {
      throw new AppError('Stock withdrawal not found', 404);
    }

    if (stockWithdrawal.status === 'finalizado') {
      throw new AppError('Esta baixa de estoque já foi finalizada.', 400);
    }

    const item = await this.stockWithdrawalRepository.createItem({
      stockWithdrawalId,
      stockProductId,
      code,
      reference,
      description,
      unity,
      quantity,
    });

    return item;
  }
}

export default CreateStockWithdrawalItemService;
