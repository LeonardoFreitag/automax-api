import { injectable, inject } from 'tsyringe';
import IOrderItemPhasesRepository from '@modules/order/repositories/IOrderItemPhasesRepository';

@injectable()
class DeleteOrderItemPhaseService {
  constructor(
    @inject('OrderItemPhasesRepository')
    private orderItemPhasesRepository: IOrderItemPhasesRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.orderItemPhasesRepository.delete(id);
  }
}

export default DeleteOrderItemPhaseService;
