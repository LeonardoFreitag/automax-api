import { injectable, inject } from 'tsyringe';
import IBudgetRepository from '@modules/budget/repositories/IBudgetRepository';
import { Budget } from '@prisma/client';

@injectable()
class ListBudgetsPaginetedService {
  constructor(
    @inject('BudgetRepository')
    private budgetRepository: IBudgetRepository,
  ) {}

  public async execute(
    sellerId: string,
    page: number,
    rows: number,
  ): Promise<Budget[] | undefined> {
    const BudgetList = await this.budgetRepository.listBudgetsPaginated(
      sellerId,
      page,
      rows,
    );

    return BudgetList;
  }
}

export default ListBudgetsPaginetedService;
