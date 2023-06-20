import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateOrderService from '@modules/order/services/CreateOrderService';
import UpdateOrderService from '@modules/order/services/UdpateOrderService';
import ListOrderService from '@modules/order/services/ListOrderService';
import DeleteOrderService from '@modules/order/services/DeleteOrderService';

export default class OrderControllers {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      customerId,
      orderId,
      orderDate,
      orderNumber,
      description,
      notes,
      status,
      tagId,
      tagProductId,
      tagReference,
      tagProductName,
      tagTissueName,
      tagSellerName,
      tagStatus,
    } = request.body;

    const createOrder = container.resolve(CreateOrderService);

    const order = await createOrder.execute({
      customerId,
      orderId,
      orderDate,
      orderNumber,
      description,
      notes,
      status,
      tagId,
      tagProductId,
      tagReference,
      tagProductName,
      tagTissueName,
      tagSellerName,
      tagStatus,
    });

    return response.json(order);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const updateOrder = container.resolve(UpdateOrderService);

    const Order = await updateOrder.execute(data);

    return response.json(Order);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { customerId } = request.query;

    const listOrders = container.resolve(ListOrderService);

    const Order = await listOrders.execute(String(customerId));

    return response.json(Order);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteOrderService = container.resolve(DeleteOrderService);

    await deleteOrderService.execute(String(id));

    return response.status(204).json();
  }
}
