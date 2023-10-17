import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateOrderService from '@modules/order/services/CreateOrderService';
import UpdateOrderService from '@modules/order/services/UdpateOrderService';
import ListOrderService from '@modules/order/services/ListOrderService';
import ListOrderByTagIdService from '@modules/order/services/ListOrderByTagIdService';
import DeleteOrderService from '@modules/order/services/DeleteOrderService';
import FinalizeOrderService from '@modules/order/services/FinalizeOrderService';

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

    // console.log(request.body);
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

  public async finalize(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id, status } = request.query;

    const finalizeOrder = container.resolve(FinalizeOrderService);

    const Order = await finalizeOrder.execute(String(id), String(status));

    return response.json(Order);
  }

  public async findByTagId(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { customerId, tagId } = request.query;

    const listOrders = container.resolve(ListOrderByTagIdService);

    const Order = await listOrders.execute(String(customerId), String(tagId));

    return response.json(Order);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteOrderService = container.resolve(DeleteOrderService);

    await deleteOrderService.execute(String(id));

    return response.status(204).json();
  }
}
