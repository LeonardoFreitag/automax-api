import { injectable, inject } from 'tsyringe';
import IInventoryRepository from '@modules/inventory/repositories/IInventoryRepository';
import { InventoryItems } from '@prisma/client';

@injectable()
class ListInventoryItemsService {
  constructor(
    @inject('InventoryRepository')
    private inventoryRepository: IInventoryRepository,
  ) {}

  public async execute(inventoryId: string): Promise<InventoryItems[]> {
    const items = await this.inventoryRepository.listItems(inventoryId);

    return items;
  }
}

export default ListInventoryItemsService;
