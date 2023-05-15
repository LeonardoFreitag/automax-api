import { injectable, inject } from 'tsyringe';
import IOrderItemPhasesRepository from '@modules/order/repositories/IOrderItemPhasesRepository';
import OrderItemPhases from '@modules/order/infra/typeorm/entities/OrderItemPhases';
import { ICreateOrderItemPhasesDTO } from '@modules/order/dtos/ICreateOrderItemPhasesDTO';

@injectable()
class CreateOrderItemPhasesService {
  constructor(
    @inject('OrderItemPhasesRepository')
    private orderItemPhasesRepository: IOrderItemPhasesRepository,
  ) {}

  public async execute({
    orderItemId,
    employeeId,
    phaseDate,
    phaseId,
    notes,
  }: ICreateOrderItemPhasesDTO): Promise<OrderItemPhases> {
    // const checkOrderItemPhasesExists = await this.orderItemPhasesRepository.findById(
    //   orderItemPhasesNumber,
    // );

    // if (checkOrderItemPhasesExists) {
    //   this.orderItemPhasesRepository.delete(checkOrderItemPhasesExists.id);
    // }

    const orderItemPhases = await this.orderItemPhasesRepository.create({
      orderItemId,
      employeeId,
      phaseDate,
      phaseId,
      notes,
    });

    return orderItemPhases;
  }
}

export default CreateOrderItemPhasesService;
