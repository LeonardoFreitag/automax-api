import { injectable, inject } from 'tsyringe';
import IOrderItemsPhasesRepository from '@modules/order/repositories/IOrderItemsPhasesRepository';

@injectable()
class DeleteOrderItemsPhasesService {
  constructor(
    @inject('OrderItemsPhasesRepository')
    private orderItemsPhasesRepository: IOrderItemsPhasesRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.orderItemsPhasesRepository.delete(id);
  }
}

export default DeleteOrderItemsPhasesService;
