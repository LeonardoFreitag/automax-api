import { injectable, inject } from 'tsyringe';
import IInventoryRepository from '@modules/inventory/repositories/IInventoryRepository';
import { Inventory } from '@prisma/client';

@injectable()
class ChangeInventoryDownloadedService {
  constructor(
    @inject('InventoryRepository')
    private inventoryRepository: IInventoryRepository,
  ) {}

  // chamado pelo ERP depois de gravar o inventário no Firebird e atualizar o estoque
  public async execute(id: string, downloaded: boolean): Promise<Inventory> {
    const inventory = await this.inventoryRepository.changeDownloaded(
      id,
      downloaded,
    );

    return inventory;
  }
}

export default ChangeInventoryDownloadedService;
