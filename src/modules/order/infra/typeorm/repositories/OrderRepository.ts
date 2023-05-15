import { getRepository, Repository } from 'typeorm';
import IOrderRepository from '@modules/order/repositories/IOrderRepository';
import { ICreateOrderDTO } from '@modules/order/dtos/ICreateOrderDTO';
import Order from '../entities/Order';

class OrderRepository implements IOrderRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = this.ormRepository.findOne({
      where: { id },
    });

    return order;
  }

  public async findByOrderNumber(
    orderNumber: string,
  ): Promise<Order | undefined> {
    const order = this.ormRepository.findOne({
      where: { orderNumber },
    });

    return order;
  }

  public async list(customerId: string): Promise<Order[]> {
    const orders = this.ormRepository.find({
      where: {
        customerId,
      },
    });

    return orders;
  }

  public async create(OrderData: ICreateOrderDTO): Promise<Order> {
    const order = this.ormRepository.create(OrderData);

    await this.ormRepository.save(order);

    return order;
  }

  public async save(order: Order): Promise<Order> {
    return this.ormRepository.save(order);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default OrderRepository;
