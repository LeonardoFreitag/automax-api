import IOrderItemsPhasesRepository from '@modules/order/repositories/IOrderItemsPhasesRepository';
import { Order, OrderItemsPhases, Prisma } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import { prisma } from '@shared/infra/prisma/prisma';

class OrderItemsPhasesRepository implements IOrderItemsPhasesRepository {
  public async listAllCaptureTodayByIdCustomer(
    customerId: string,
    dateCapture: string,
  ): Promise<Order[]> {
    const todayStart = new Date(dateCapture);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const orderItemsPhases = await prisma.orderItemsPhases.findMany({
      include: {
        order: true,
      },
      where: {
        phaseDate: {
          gte: todayStart,
          lte: todayEnd,
        },
        order: {
          customerId,
        },
      },
    });

    const orderIds = orderItemsPhases.map(oip => oip.orderId);

    const orders = await prisma.order.findMany({
      include: {
        OrderItemsPhases: true,
      },
      where: {
        id: {
          in: orderIds,
        },
      },
    });

    return orders;
  }

  public async listAllCaptureToday(dateCapture: string): Promise<Order[]> {
    const todayStart = new Date(dateCapture);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const orderItemsPhases = await prisma.orderItemsPhases.findMany({
      where: {
        phaseDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    const orderIds = orderItemsPhases.map(oip => oip.orderId);

    const orders = await prisma.order.findMany({
      include: {
        OrderItemsPhases: true,
      },
      where: {
        id: {
          in: orderIds,
        },
      },
    });

    return orders;
  }

  public async listToday(dateCapture: string): Promise<OrderItemsPhases[]> {
    const todayStart = new Date(dateCapture);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const orderItemsPhasess = await prisma.orderItemsPhases.findMany({
      where: {
        phaseDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    return orderItemsPhasess;
  }

  public async findById(id: string): Promise<OrderItemsPhases> {
    const orderItemsPhases = await prisma.orderItemsPhases.findUnique({
      where: {
        id,
      },
    });
    return orderItemsPhases;
  }

  public async findByOrderIdAndPhaseId(
    orderId: string,
    phaseId: string,
  ): Promise<OrderItemsPhases> {
    const orderItemsPhases = await prisma.orderItemsPhases.findFirst({
      where: {
        orderId,
        phaseId,
      },
    });
    return orderItemsPhases;
  }

  public async list(orderId: string): Promise<OrderItemsPhases[]> {
    const orderItemsPhasess = await prisma.orderItemsPhases.findMany({
      where: {
        orderId,
      },
    });

    return orderItemsPhasess;
  }

  public async create(
    orderItemsPhasesData: Prisma.OrderItemsPhasesUncheckedCreateInput,
  ): Promise<OrderItemsPhases> {
    const orderItemsPhases = await prisma.orderItemsPhases.create({
      data: orderItemsPhasesData,
    });

    return orderItemsPhases;
  }

  public async save(
    orderItemsPhases: OrderItemsPhases,
  ): Promise<OrderItemsPhases> {
    const orderItemsPhasesUpdated = await prisma.orderItemsPhases.update({
      where: {
        id: orderItemsPhases.id,
      },
      data: {
        employeeId: orderItemsPhases.employeeId,
        employeeName: orderItemsPhases.employeeName,
        phaseDate: orderItemsPhases.phaseDate,
        phaseId: orderItemsPhases.phaseId,
        phaseName: orderItemsPhases.phaseName,
        notes: orderItemsPhases.notes,
      },
    });
    return orderItemsPhasesUpdated;
  }

  public async delete(id: string): Promise<void> {
    const foundOrderItemsPhases = await prisma.orderItemsPhases.findUnique({
      where: { id },
    });

    if (!foundOrderItemsPhases) {
      throw new AppError('OrderItemsPhases not found', 404);
    }

    await prisma.orderItemsPhases.delete({
      where: { id },
    });
  }
}

export default OrderItemsPhasesRepository;
