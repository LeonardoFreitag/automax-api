import { injectable, inject } from 'tsyringe';
import IInventoryRepository from '@modules/inventory/repositories/IInventoryRepository';
import { Inventory } from '@prisma/client';

@injectable()
class UpdateInventoryStatusService {
  constructor(
    @inject('InventoryRepository')
    private inventoryRepository: IInventoryRepository,
  ) {}

  // status: "em_andamento" | "finalizado"
  public async execute(id: string, status: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.updateStatus(id, status);

    return inventory;
  }
}

export default UpdateInventoryStatusService;
