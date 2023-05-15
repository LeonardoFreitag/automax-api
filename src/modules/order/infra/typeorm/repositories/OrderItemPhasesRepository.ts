import { getRepository, Repository } from 'typeorm';
import IOrderItemPhasesRepository from '@modules/order/repositories/IOrderItemPhasesRepository';
import { ICreateOrderItemPhasesDTO } from '@modules/order/dtos/ICreateOrderItemPhasesDTO';
import OrderItemPhases from '../entities/OrderItemPhases';

class OrderItemPhasesRepository implements IOrderItemPhasesRepository {
  private ormRepository: Repository<OrderItemPhases>;

  constructor() {
    this.ormRepository = getRepository(OrderItemPhases);
  }

  public async findById(id: string): Promise<OrderItemPhases | undefined> {
    const orderItemPhases = this.ormRepository.findOne({
      where: { id },
    });

    return orderItemPhases;
  }

  public async list(orderItemId: string): Promise<OrderItemPhases[]> {
    const orderItemPhasess = this.ormRepository.find({
      where: {
        orderItemId,
      },
    });

    return orderItemPhasess;
  }

  public async create(
    OrderItemPhasesData: ICreateOrderItemPhasesDTO,
  ): Promise<OrderItemPhases> {
    const orderItemPhases = this.ormRepository.create(OrderItemPhasesData);

    await this.ormRepository.save(orderItemPhases);

    return orderItemPhases;
  }

  public async save(
    orderItemPhases: OrderItemPhases,
  ): Promise<OrderItemPhases> {
    return this.ormRepository.save(orderItemPhases);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default OrderItemPhasesRepository;
