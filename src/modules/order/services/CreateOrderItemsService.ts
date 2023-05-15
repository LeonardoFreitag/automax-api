import { injectable, inject } from 'tsyringe';
import IOrderItemsRepository from '@modules/order/repositories/IOrderItemsRepository';
import OrderItems from '@modules/order/infra/typeorm/entities/OrderItems';
import { ICreateOrderItemsDTO } from '@modules/order/dtos/ICreateOrderItemsDTO';

@injectable()
class CreateOrderItemsService {
  constructor(
    @inject('OrderItemsRepository')
    private orderItemsRepository: IOrderItemsRepository,
  ) {}

  public async execute({
    orderId,
    productId,
    saleId,
    description,
    phases,
  }: ICreateOrderItemsDTO): Promise<OrderItems> {
    // const checkOrderItemsExists = await this.orderItemsRepository.findById(
    //   orderItemsNumber,
    // );

    // if (checkOrderItemsExists) {
    //   this.orderItemsRepository.delete(checkOrderItemsExists.id);
    // }

    const orderItems = await this.orderItemsRepository.create({
      orderId,
      productId,
      saleId,
      description,
      phases,
    });

    return orderItems;
  }
}

export default CreateOrderItemsService;
