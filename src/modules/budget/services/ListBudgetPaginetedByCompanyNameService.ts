import { injectable, inject } from 'tsyringe';
import IBudgetRepository from '@modules/budget/repositories/IBudgetRepository';
import { Budget } from '@prisma/client';

@injectable()
class ListBudgetsPaginetedCompanyNameService {
  constructor(
    @inject('BudgetRepository')
    private budgetRepository: IBudgetRepository,
  ) {}

  public async execute(
    sellerId: string,
    companyName: string,
    page: number,
    rows: number,
  ): Promise<Budget[] | undefined> {
    const BudgetList =
      await this.budgetRepository.listBudgetsPaginatedByCompanyName(
        sellerId,
        companyName,
        page,
        rows,
      );

    return BudgetList;
  }
}

export default ListBudgetsPaginetedCompanyNameService;
