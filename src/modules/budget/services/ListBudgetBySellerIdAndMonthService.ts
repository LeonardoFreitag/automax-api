import { injectable, inject } from 'tsyringe';
import IBudgetRepository from '@modules/budget/repositories/IBudgetRepository';
import { Budget } from '@prisma/client';

@injectable()
class ListBudgetBySellerIdAndMonthService {
  constructor(
    @inject('BudgetRepository')
    private budgetRepository: IBudgetRepository,
  ) {}

  public async execute(
    sellerId: string,
    month: number,
    year: number,
  ): Promise<Budget[] | undefined> {
    const allBudgetByidCustomer =
      await this.budgetRepository.listBySellerIdAndMonth(sellerId, month, year);

    return allBudgetByidCustomer;
  }
}

export default ListBudgetBySellerIdAndMonthService;
