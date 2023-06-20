import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateOrderItemsPhasesService from '@modules/order/services/CreateOrderItemsPhasesService';
import UpdateOrderItemsPhasesService from '@modules/order/services/UdpateOrderItemsPhasesService';
import ListOrderItemsPhasesService from '@modules/order/services/ListOrderItemsPhasesService';
import DeleteOrderItemsPhasesService from '@modules/order/services/DeleteOrderItemsPhasesService';

export default class OrderItemPhaseControllers {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      orderId,
      employeeId,
      employeeName,
      phaseDate,
      phaseId,
      phaseName,
      notes,
    } = request.body;

    const createOrderItemPhaseService = container.resolve(
      CreateOrderItemsPhasesService,
    );

    const orderItemPhase = await createOrderItemPhaseService.execute({
      orderId,
      employeeId,
      employeeName,
      phaseDate,
      phaseId,
      phaseName,
      notes,
    });

    return response.json(orderItemPhase);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const updateOrderItemPhaseService = container.resolve(
      UpdateOrderItemsPhasesService,
    );

    const orderItemPhaseUpdated = await updateOrderItemPhaseService.execute(
      data,
    );

    return response.json(orderItemPhaseUpdated);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { orderId } = request.query;

    const listOrderItemsPhaseService = container.resolve(
      ListOrderItemsPhasesService,
    );

    const orderItemsPhase = await listOrderItemsPhaseService.execute(
      String(orderId),
    );

    return response.json(orderItemsPhase);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteOrderItemPhaseService = container.resolve(
      DeleteOrderItemsPhasesService,
    );

    await deleteOrderItemPhaseService.execute(String(id));

    return response.status(204).json();
  }
}
