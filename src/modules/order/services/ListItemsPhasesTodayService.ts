import { injectable, inject } from 'tsyringe';
import IOrderItemsPhasesRepository from '@modules/order/repositories/IOrderItemsPhasesRepository';
import { Order } from '@prisma/client';

@injectable()
class ListItemsPhasesTodayService {
  constructor(
    @inject('OrderItemsPhasesRepository')
    private orderItemsPhasesRepository: IOrderItemsPhasesRepository,
  ) {}

  public async execute(dateCapture: string): Promise<Order[] | undefined> {
    const allOrderItemsPhasesByidCustomer =
      await this.orderItemsPhasesRepository.listAllCaptureToday(dateCapture);

    return allOrderItemsPhasesByidCustomer;
  }
}

export default ListItemsPhasesTodayService;
