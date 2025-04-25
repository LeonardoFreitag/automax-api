import { injectable, inject } from 'tsyringe';
import IOrderItemsPhasesRepository from '@modules/order/repositories/IOrderItemsPhasesRepository';
import { Order } from '@prisma/client';

@injectable()
class ListItemsPhasesTodayByCustomerIsService {
  constructor(
    @inject('OrderItemsPhasesRepository')
    private orderItemsPhasesRepository: IOrderItemsPhasesRepository,
  ) {}

  public async execute(
    customerId: string,
    dateCapture: string,
  ): Promise<Order[] | undefined> {
    const allOrderItemsPhasesByidCustomer =
      await this.orderItemsPhasesRepository.listAllCaptureTodayByIdCustomer(
        customerId,
        dateCapture,
      );

    return allOrderItemsPhasesByidCustomer;
  }
}

export default ListItemsPhasesTodayByCustomerIsService;
