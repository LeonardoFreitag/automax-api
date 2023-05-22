import { injectable, inject } from 'tsyringe';
import IOrderItemPhasesRepository from '@modules/order/repositories/IOrderItemPhasesRepository';
import { OrderItemsPhases, Prisma } from '@prisma/client';

@injectable()
class CreateOrderItemPhasesService {
  constructor(
    @inject('OrderItemPhasesRepository')
    private orderItemPhasesRepository: IOrderItemPhasesRepository,
  ) {}

  public async execute({
    orderItemsId,
    employeeId,
    phaseDate,
    phaseId,
    notes,
  }: Prisma.OrderItemsPhasesUncheckedCreateInput): Promise<OrderItemsPhases> {
    const orderItemPhases = await this.orderItemPhasesRepository.create({
      orderItemsId,
      employeeId,
      phaseDate,
      phaseId,
      notes,
    });

    return orderItemPhases;
  }
}

export default CreateOrderItemPhasesService;
