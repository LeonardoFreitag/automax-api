import { injectable, inject } from 'tsyringe';
import IBudgetRepository from '@modules/budget/repositories/IBudgetRepository';
import { Budget } from '@prisma/client';

@injectable()
class ListBudgetByIdService {
  constructor(
    @inject('BudgetRepository')
    private budgetRepository: IBudgetRepository,
  ) {}

  public async execute(id: string): Promise<Budget | undefined> {
    const allBudgetByidCustomer = await this.budgetRepository.findById(id);

    return allBudgetByidCustomer;
  }
}

export default ListBudgetByIdService;
