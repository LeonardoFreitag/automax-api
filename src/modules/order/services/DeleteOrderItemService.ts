import { injectable, inject } from 'tsyringe';
import IOrderItemsRepository from '@modules/order/repositories/IOrderItemsRepository';

@injectable()
class DeleteOrderService {
  constructor(
    @inject('OrderItemsRepository')
    private orderItemsRepository: IOrderItemsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.orderItemsRepository.delete(id);
  }
}

export default DeleteOrderService;
