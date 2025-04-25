import { injectable, inject } from 'tsyringe';
import IOrderItemsPhasesRepository from '@modules/order/repositories/IOrderItemsPhasesRepository';
import { OrderItemsPhases, Prisma } from '@prisma/client';
import AppError from '@shared/errors/AppError';

@injectable()
class CreateOrderItemsPhasesService {
  constructor(
    @inject('OrderItemsPhasesRepository')
    private orderItemsPhasesRepository: IOrderItemsPhasesRepository,
  ) {}

  public async execute({
    employeeId,
    employeeName,
    phaseDate,
    phaseId,
    phaseName,
    notes,
    orderId,
  }: Prisma.OrderItemsPhasesUncheckedCreateInput): Promise<OrderItemsPhases> {
    const checkOrderItemsPhasesExists =
      await this.orderItemsPhasesRepository.findByOrderIdAndPhaseId(
        orderId,
        phaseId,
      );

    if (checkOrderItemsPhasesExists) {
      throw new AppError('Phase already exists!', 409);
    }

    const orderItemsPhases = await this.orderItemsPhasesRepository.create({
      employeeId,
      employeeName,
      phaseDate,
      phaseId,
      phaseName,
      notes,
      orderId,
    });

    return orderItemsPhases;
  }
}

export default CreateOrderItemsPhasesService;
