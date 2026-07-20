import { injectable, inject } from 'tsyringe';
import IInventoryRepository from '@modules/inventory/repositories/IInventoryRepository';
import { Inventory } from '@prisma/client';

interface IRequest {
  customerId: string;
  userId: string;
  userName: string;
}

@injectable()
class CreateInventoryService {
  constructor(
    @inject('InventoryRepository')
    private inventoryRepository: IInventoryRepository,
  ) {}

  public async execute({
    customerId,
    userId,
    userName,
  }: IRequest): Promise<Inventory> {
    const inventory = await this.inventoryRepository.create({
      customerId,
      userId,
      userName,
      status: 'em_andamento',
      downloaded: false,
    });

    return inventory;
  }
}

export default CreateInventoryService;
