import { injectable, inject } from 'tsyringe';
import IInventoryRepository from '@modules/inventory/repositories/IInventoryRepository';
import { InventoryItems } from '@prisma/client';
import AppError from '@shared/errors/AppError';

interface IRequest {
  inventoryId: string;
  stockProductId: string;
  code: string;
  reference: string;
  description: string;
  unity: string;
  quantity: number;
}

@injectable()
class CreateInventoryItemService {
  constructor(
    @inject('InventoryRepository')
    private inventoryRepository: IInventoryRepository,
  ) {}

  public async execute({
    inventoryId,
    stockProductId,
    code,
    reference,
    description,
    unity,
    quantity,
  }: IRequest): Promise<InventoryItems> {
    const inventory = await this.inventoryRepository.findById(inventoryId);

    if (!inventory) {
      throw new AppError('Inventory not found', 404);
    }

    if (inventory.status === 'finalizado') {
      throw new AppError('Este inventário já foi finalizado.', 400);
    }

    const item = await this.inventoryRepository.createItem({
      inventoryId,
      stockProductId,
      code,
      reference,
      description,
      unity,
      quantity,
    });

    return item;
  }
}

export default CreateInventoryItemService;
