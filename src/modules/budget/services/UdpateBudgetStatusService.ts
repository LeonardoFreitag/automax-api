import AppError from '@shared/errors/AppError';
import IBudgetRepository from '@modules/budget/repositories/IBudgetRepository';
import { injectable, inject } from 'tsyringe';
import { Budget } from '@prisma/client';

interface BudgetStatus {
  id: string;
  budgetNumber: string;
  budgetStatus: string;
  refusedNotes: string;
}

@injectable()
class UpdateBudgetStatusService {
  constructor(
    @inject('BudgetRepository')
    private budgetRepository: IBudgetRepository,
  ) {}

  public async execute(data: BudgetStatus): Promise<Budget> {
    const { id } = data;
    const budget = await this.budgetRepository.findById(id);

    if (!budget) {
      throw new AppError('budget not found', 404);
    }

    budget.budgetNumber = data.budgetNumber;
    budget.budgetStatus = data.budgetStatus;
    budget.refusedNotes = data.refusedNotes;

    return this.budgetRepository.save(budget);
  }
}

export default UpdateBudgetStatusService;
