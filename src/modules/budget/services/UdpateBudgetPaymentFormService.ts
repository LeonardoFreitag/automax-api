import AppError from '@shared/errors/AppError';
import IBudgetRepository from '@modules/budget/repositories/IBudgetRepository';
import { injectable, inject } from 'tsyringe';
import { BudgetPaymentForm } from '@prisma/client';

@injectable()
class UpdateBudgetService {
  constructor(
    @inject('BudgetRepository')
    private budgetRepository: IBudgetRepository,
  ) {}

  public async execute(data: BudgetPaymentForm): Promise<BudgetPaymentForm> {
    const { id } = data;
    const budgetPaymentForm = await this.budgetRepository.findPaymentFormById(
      id,
    );

    if (!budgetPaymentForm) {
      throw new AppError('Budget Item not found', 404);
    }

    budgetPaymentForm.paymentFormId = data.paymentFormId;
    budgetPaymentForm.description = data.description;
    budgetPaymentForm.amount = data.amount;
    budgetPaymentForm.installments = data.installments;

    return this.budgetRepository.savePaymentForm(budgetPaymentForm);
  }
}

export default UpdateBudgetService;
