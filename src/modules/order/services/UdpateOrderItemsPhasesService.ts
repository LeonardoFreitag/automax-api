import AppError from '@shared/errors/AppError';
import IOrderItemsPhasesRepository from '@modules/order/repositories/IOrderItemsPhasesRepository';
import { injectable, inject } from 'tsyringe';
import { OrderItemsPhases } from '@prisma/client';

@injectable()
class UpdateOrderItemsPhasesService {
  constructor(
    @inject('OrderItemsPhasesRepository')
    private orderItemsPhasesRepository: IOrderItemsPhasesRepository,
  ) {}

  public async execute(data: OrderItemsPhases): Promise<OrderItemsPhases> {
    const { id } = data;
    const orderItemsPhases = await this.orderItemsPhasesRepository.findById(id);

    if (!orderItemsPhases) {
      throw new AppError('OrderItemsPhases not found', 404);
    }

    orderItemsPhases.employeeId = data.employeeId;
    orderItemsPhases.employeeName = data.employeeName;
    orderItemsPhases.phaseDate = data.phaseDate;
    orderItemsPhases.phaseId = data.phaseId;
    orderItemsPhases.phaseName = data.phaseName;
    orderItemsPhases.notes = data.notes;

    return this.orderItemsPhasesRepository.save(orderItemsPhases);
  }
}

export default UpdateOrderItemsPhasesService;
