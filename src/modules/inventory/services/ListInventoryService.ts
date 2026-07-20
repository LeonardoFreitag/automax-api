import { injectable, inject } from 'tsyringe';
import IInventoryRepository from '@modules/inventory/repositories/IInventoryRepository';
import { Inventory } from '@prisma/client';

@injectable()
class ListInventoryService {
  constructor(
    @inject('InventoryRepository')
    private inventoryRepository: IInventoryRepository,
  ) {}

  public async execute(
    customerId: string,
    downloaded?: boolean,
  ): Promise<Inventory[]> {
    const inventories = await this.inventoryRepository.list(
      customerId,
      downloaded,
    );

    return inventories;
  }
}

export default ListInventoryService;
