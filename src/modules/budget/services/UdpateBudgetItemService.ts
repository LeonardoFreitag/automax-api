import AppError from '@shared/errors/AppError';
import IBudgetRepository from '@modules/budget/repositories/IBudgetRepository';
import { injectable, inject } from 'tsyringe';
import { BudgetItems } from '@prisma/client';

@injectable()
class UpdateBudgetService {
  constructor(
    @inject('BudgetRepository')
    private budgetRepository: IBudgetRepository,
  ) {}

  public async execute(data: BudgetItems): Promise<BudgetItems> {
    const { id } = data;
    const budgetItem = await this.budgetRepository.findItemById(id);

    if (!budgetItem) {
      throw new AppError('Budget Item not found', 404);
    }

    budgetItem.productId = data.productId;
    budgetItem.code = data.code;
    budgetItem.reference = data.reference;
    budgetItem.description = data.description;
    budgetItem.unity = data.unity;
    budgetItem.tableId = data.tableId;
    budgetItem.tableCode = data.tableCode;
    budgetItem.tableName = data.tableName;
    budgetItem.price = data.price;
    budgetItem.quantity = data.quantity;
    budgetItem.amount = data.amount;
    budgetItem.notes = data.notes;
    budgetItem.originalPrice = data.originalPrice;
    budgetItem.groupId = data.groupId;
    budgetItem.groupName = data.groupName;
    budgetItem.tissueId = data.tissueId;
    budgetItem.tissueCode = data.tissueCode;
    budgetItem.tissueName = data.tissueName;
    budgetItem.underMeasure = data.underMeasure;
    budgetItem.widthSale = data.widthSale;

    return this.budgetRepository.saveItem(budgetItem);
  }
}

export default UpdateBudgetService;
