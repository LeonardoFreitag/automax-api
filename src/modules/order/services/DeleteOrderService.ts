import { injectable, inject } from 'tsyringe';
import IOrderRepository from '@modules/order/repositories/IOrderRepository';

@injectable()
class DeleteOrderService {
  constructor(
    @inject('OrderRepository')
    private orderRepository: IOrderRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.orderRepository.delete(id);
  }
}

export default DeleteOrderService;
