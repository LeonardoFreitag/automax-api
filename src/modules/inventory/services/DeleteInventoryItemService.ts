import { injectable, inject } from 'tsyringe';
import IInventoryRepository from '@modules/inventory/repositories/IInventoryRepository';

@injectable()
class DeleteInventoryItemService {
  constructor(
    @inject('InventoryRepository')
    private inventoryRepository: IInventoryRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.inventoryRepository.deleteItem(id);
  }
}

export default DeleteInventoryItemService;
