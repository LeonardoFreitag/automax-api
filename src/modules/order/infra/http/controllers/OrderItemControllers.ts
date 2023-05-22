import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateOrderItemsService from '@modules/order/services/CreateOrderItemsService';
import UpdateOrderItemsService from '@modules/order/services/UdpateOrderItemsService';
import ListOrderItemsService from '@modules/order/services/ListOrderItemsService';
import DeleteOrderItemsService from '@modules/order/services/DeleteOrderItemService';

export default class OrderItemsControllers {
  public async create(request: Request, response: Response): Promise<Response> {
    const { orderId, productId, saleId, description, OrderItemsPhases } =
      request.body;

    const createOrderItemService = container.resolve(CreateOrderItemsService);

    const orderItem = await createOrderItemService.execute({
      orderId,
      productId,
      saleId,
      description,
      OrderItemsPhases,
    });

    return response.json(orderItem);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const updateOrderItemService = container.resolve(UpdateOrderItemsService);

    const orderItemUpdated = await updateOrderItemService.execute(data);

    return response.json(orderItemUpdated);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { orderId } = request.query;

    const listOrderItemsService = container.resolve(ListOrderItemsService);

    const orderItems = await listOrderItemsService.execute(String(orderId));

    return response.json(orderItems);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteOrderItemsService = container.resolve(DeleteOrderItemsService);

    await deleteOrderItemsService.execute(String(id));

    return response.status(204).json();
  }
}
