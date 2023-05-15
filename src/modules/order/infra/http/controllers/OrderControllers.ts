import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateOrderService from '@modules/order/services/CreateOrderService';
import CreateOrderItemsService from '@modules/order/services/CreateOrderItemsService';
import UpdateOrderService from '@modules/order/services/UdpateOrderService';
import ListOrderService from '@modules/order/services/ListOrderService';
import DeleteOrderService from '@modules/order/services/DeleteOrderService';

export default class OrderControllers {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      customerId,
      orderNumber,
      userId,
      orderDate,
      description,
      notes,
      items,
      finished,
      canceled,
    } = request.body;

    const createOrder = container.resolve(CreateOrderService);

    const order = await createOrder.execute({
      customerId,
      orderNumber,
      userId,
      orderDate,
      description,
      notes,
      items,
      finished,
      canceled,
    });

    return response.json(classToClass(order));
  }

  public async createItem(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { orderId, productId, saleId, description, phases } = request.body;

    const createOrderItem = container.resolve(CreateOrderItemsService);

    const orderItem = await createOrderItem.execute({
      orderId,
      productId,
      saleId,
      description,
      phases,
    });

    return response.json(classToClass(orderItem));
  }

  public async createItemPhases(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { orderId, productId, saleId, description, phases } = request.body;

    const createOrderItem = container.resolve(CreateOrderItemsService);

    const orderItem = await createOrderItem.execute({
      orderId,
      productId,
      saleId,
      description,
      phases,
    });

    return response.json(classToClass(orderItem));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const updateOrder = container.resolve(UpdateOrderService);

    const Order = await updateOrder.execute(data);

    return response.json(classToClass(Order));
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { customerId } = request.query;

    const listOrders = container.resolve(ListOrderService);

    const Order = await listOrders.execute(String(customerId));

    return response.json(classToClass(Order));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteOrderService = container.resolve(DeleteOrderService);

    await deleteOrderService.execute(String(id));

    return response.status(204).json();
  }
}
