import AppError from '@shared/errors/AppError';
import IBudgetRepository from '@modules/budget/repositories/IBudgetRepository';
import { injectable, inject } from 'tsyringe';
import { Budget } from '@prisma/client';

@injectable()
class UpdateBudgetService {
  constructor(
    @inject('BudgetRepository')
    private budgetRepository: IBudgetRepository,
  ) {}

  public async execute(data: Budget): Promise<Budget> {
    const { id } = data;
    const budget = await this.budgetRepository.findById(id);

    if (!budget) {
      throw new AppError('Budget not found', 404);
    }

    budget.budgetNumber = data.budgetNumber;
    budget.clientId = data.clientId;
    budget.amount = data.amount;
    budget.discount = data.discount;
    budget.total = data.total;
    budget.notes = data.notes;
    budget.budgetStatus = data.budgetStatus;
    budget.refusedNotes = data.refusedNotes;
    budget.returnedNotes = data.returnedNotes;

    return this.budgetRepository.save(budget);
  }
}

export default UpdateBudgetService;
