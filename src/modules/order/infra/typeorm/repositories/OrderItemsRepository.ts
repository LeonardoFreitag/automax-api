import { getRepository, Repository } from 'typeorm';
import IOrderItemsRepository from '@modules/order/repositories/IOrderItemsRepository';
import { ICreateOrderItemsDTO } from '@modules/order/dtos/ICreateOrderItemsDTO';
import OrderItems from '../entities/OrderItems';

class OrderItemsRepository implements IOrderItemsRepository {
  private ormRepository: Repository<OrderItems>;

  constructor() {
    this.ormRepository = getRepository(OrderItems);
  }

  public async findById(id: string): Promise<OrderItems | undefined> {
    const orderItems = this.ormRepository.findOne({
      where: { id },
    });

    return orderItems;
  }

  public async list(orderId: string): Promise<OrderItems[]> {
    const orderItemss = this.ormRepository.find({
      where: {
        orderId,
      },
      join: {
        alias: 'OrderItems',
        leftJoinAndSelect: {
          contacts: 'OrderItems.phases',
        },
      },
    });

    return orderItemss;
  }

  public async create(
    OrderItemsData: ICreateOrderItemsDTO,
  ): Promise<OrderItems> {
    const orderItems = this.ormRepository.create(OrderItemsData);

    await this.ormRepository.save(orderItems);

    return orderItems;
  }

  public async save(orderItems: OrderItems): Promise<OrderItems> {
    return this.ormRepository.save(orderItems);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default OrderItemsRepository;
