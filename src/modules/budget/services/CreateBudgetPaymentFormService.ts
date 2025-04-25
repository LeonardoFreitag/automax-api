import { injectable, inject } from 'tsyringe';
import IBudgetRepository from '@modules/budget/repositories/IBudgetRepository';
import { Prisma, BudgetPaymentForm } from '@prisma/client';

@injectable()
class CreateBudgetPaymentFormervice {
  constructor(
    @inject('BudgetRepository')
    private budgetRepository: IBudgetRepository,
  ) {}

  public async execute({
    budgetId,
    paymentFormId,
    description,
    amount,
    installments,
  }: Prisma.BudgetPaymentFormUncheckedCreateInput): Promise<BudgetPaymentForm> {
    const budgetPaymentForm = await this.budgetRepository.createPaymentForm({
      budgetId,
      paymentFormId,
      description,
      amount,
      installments,
    });

    return budgetPaymentForm;
  }
}

export default CreateBudgetPaymentFormervice;
