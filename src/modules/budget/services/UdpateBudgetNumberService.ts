import AppError from '@shared/errors/AppError';
import IBudgetRepository from '@modules/budget/repositories/IBudgetRepository';
import { injectable, inject } from 'tsyringe';
import { Budget } from '@prisma/client';

@injectable()
class UpdateBudgetNumberService {
  constructor(
    @inject('BudgetRepository')
    private budgetRepository: IBudgetRepository,
  ) {}

  public async execute(id: string, budgetNumber: string): Promise<Budget> {
    const budget = await this.budgetRepository.findById(id);

    if (!budget) {
      throw new AppError('budget not found', 404);
    }

    budget.budgetNumber = budgetNumber;

    return this.budgetRepository.save(budget);
  }
}

export default UpdateBudgetNumberService;
