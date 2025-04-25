import { injectable, inject } from 'tsyringe';
import IBudgetRepository from '@modules/budget/repositories/IBudgetRepository';

@injectable()
class DeleteBudgetService {
  constructor(
    @inject('BudgetRepository')
    private budgetRepository: IBudgetRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.budgetRepository.deletePaymentForm(id);
  }
}

export default DeleteBudgetService;
