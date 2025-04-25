import { injectable, inject } from 'tsyringe';
import IBudgetRepository from '@modules/budget/repositories/IBudgetRepository';
import { Prisma, BudgetItems } from '@prisma/client';

@injectable()
class CreateBudgetItemService {
  constructor(
    @inject('BudgetRepository')
    private budgetRepository: IBudgetRepository,
  ) {}

  public async execute({
    budgetId,
    productId,
    code,
    reference,
    description,
    unity,
    tableId,
    tableCode,
    tableName,
    price,
    quantity,
    amount,
    notes,
    originalPrice,
    groupId,
    groupName,
    tissueId,
    tissueCode,
    tissueName,
    underMeasure,
    widthSale,
  }: Prisma.BudgetItemsUncheckedCreateInput): Promise<BudgetItems> {
    const budgetItem = await this.budgetRepository.createItems({
      budgetId,
      productId,
      code,
      reference,
      description,
      unity,
      tableId,
      tableCode,
      tableName,
      price,
      quantity,
      amount,
      notes,
      originalPrice,
      groupId,
      groupName,
      tissueId,
      tissueCode,
      tissueName,
      underMeasure,
      widthSale,
    });

    return budgetItem;
  }
}

export default CreateBudgetItemService;
