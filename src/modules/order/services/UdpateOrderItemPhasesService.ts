import AppError from '@shared/errors/AppError';
import IOrderItemPhasesRepository from '@modules/order/repositories/IOrderItemPhasesRepository';
import { injectable, inject } from 'tsyringe';
import { OrderItemsPhases } from '@prisma/client';

@injectable()
class UpdateOrderItemPhasesService {
  constructor(
    @inject('OrderItemPhasesRepository')
    private orderItemPhasesRepository: IOrderItemPhasesRepository,
  ) {}

  public async execute(data: OrderItemsPhases): Promise<OrderItemsPhases> {
    const { id } = data;
    const orderItemPhase = await this.orderItemPhasesRepository.findById(id);

    if (!orderItemPhase) {
      throw new AppError('OrderItemPhases not found');
    }

    orderItemPhase.employeeId = data.employeeId;
    orderItemPhase.phaseDate = data.phaseDate;
    orderItemPhase.phaseId = data.phaseId;
    orderItemPhase.notes = data.notes;

    return this.orderItemPhasesRepository.save(orderItemPhase);
  }
}

export default UpdateOrderItemPhasesService;
