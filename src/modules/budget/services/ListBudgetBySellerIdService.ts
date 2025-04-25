import { injectable, inject } from 'tsyringe';
import IBudgetRepository from '@modules/budget/repositories/IBudgetRepository';
import { Budget } from '@prisma/client';

@injectable()
class ListBudgetBySellerIdService {
  constructor(
    @inject('BudgetRepository')
    private budgetRepository: IBudgetRepository,
  ) {}

  public async execute(sellerId: string): Promise<Budget[] | undefined> {
    const allBudgetByidCustomer = await this.budgetRepository.listBySellerId(
      sellerId,
    );

    return allBudgetByidCustomer;
  }
}

export default ListBudgetBySellerIdService;
