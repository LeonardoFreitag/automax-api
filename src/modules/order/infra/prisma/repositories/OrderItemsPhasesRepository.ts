import IOrderItemsPhasesRepository from '@modules/order/repositories/IOrderItemsPhasesRepository';
import { OrderItemsPhases, Prisma } from '@prisma/client';
import { prisma } from '@shared/infra/prisma/prisma';

class OrderItemsPhasesRepository implements IOrderItemsPhasesRepository {
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
    await prisma.orderItemsPhases.delete({
      where: { id },
    });
  }
}

export default OrderItemsPhasesRepository;
