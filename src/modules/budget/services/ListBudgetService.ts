import { injectable, inject } from 'tsyringe';
import IBudgetRepository from '@modules/budget/repositories/IBudgetRepository';
import { Budget } from '@prisma/client';

@injectable()
class ListBudgetService {
  constructor(
    @inject('BudgetRepository')
    private budgetRepository: IBudgetRepository,
  ) {}

  public async execute(
    customerId: string,
    BudgetStatus: string,
  ): Promise<Budget[] | undefined> {
    const allBudgetByidCustomer = await this.budgetRepository.list(
      customerId,
      BudgetStatus,
    );

    return allBudgetByidCustomer;
  }
}

export default ListBudgetService;
