import { injectable, inject } from 'tsyringe';
import IBudgetRepository from '@modules/budget/repositories/IBudgetRepository';
import { Prisma, Budget } from '@prisma/client';

@injectable()
class CreateBudgetService {
  constructor(
    @inject('BudgetRepository')
    private budgetRepository: IBudgetRepository,
  ) {}

  public async execute({
    customerId,
    sellerId,
    budgetNumber,
    budgetDate,
    budgetExpiration,
    clientId,
    amount,
    discount,
    increment,
    total,
    notes,
    budgetStatus,
    refusedNotes,
    returnedNotes,
    BudgetItems,
    BudgetPaymentForm,
  }: Prisma.BudgetUncheckedCreateInput): Promise<Budget> {
    const budget = await this.budgetRepository.create({
      customerId,
      sellerId,
      budgetNumber,
      budgetDate,
      budgetExpiration,
      clientId,
      amount,
      discount,
      increment,
      total,
      notes,
      budgetStatus,
      refusedNotes,
      returnedNotes,
      BudgetItems,
      BudgetPaymentForm,
    });

    return budget;
  }
}

export default CreateBudgetService;
