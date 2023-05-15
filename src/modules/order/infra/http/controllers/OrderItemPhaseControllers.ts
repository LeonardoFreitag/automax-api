import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateOrderItemPhasesService from '@modules/order/services/CreateOrderItemPhasesService';
import UpdateOrderItemPhasesService from '@modules/order/services/UdpateOrderItemPhasesService';
import ListOrderItemPhasesService from '@modules/order/services/ListOrderItemPhasesService';
import DeleteOrderItemPhasesService from '@modules/order/services/DeleteOrderItemPhasesService';

export default class OrderItemPhaseControllers {
  public async create(request: Request, response: Response): Promise<Response> {
    const { orderItemId, employeeId, phaseDate, phaseId, notes } = request.body;

    const createOrderItemPhaseService = container.resolve(
      CreateOrderItemPhasesService,
    );

    const orderItemPhase = await createOrderItemPhaseService.execute({
      orderItemId,
      employeeId,
      phaseDate,
      phaseId,
      notes,
    });

    return response.json(classToClass(orderItemPhase));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const updateOrderItemPhaseService = container.resolve(
      UpdateOrderItemPhasesService,
    );

    const orderItemPhaseUpdated = await updateOrderItemPhaseService.execute(
      data,
    );

    return response.json(classToClass(orderItemPhaseUpdated));
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { orderItemId } = request.query;

    const listOrderItemsPhaseService = container.resolve(
      ListOrderItemPhasesService,
    );

    const orderItemsPhase = await listOrderItemsPhaseService.execute(
      String(orderItemId),
    );

    return response.json(classToClass(orderItemsPhase));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteOrderItemPhaseService = container.resolve(
      DeleteOrderItemPhasesService,
    );

    await deleteOrderItemPhaseService.execute(String(id));

    return response.status(204).json();
  }
}
