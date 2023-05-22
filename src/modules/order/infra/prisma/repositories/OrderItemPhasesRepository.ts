import IOrderItemPhasesRepository from '@modules/order/repositories/IOrderItemPhasesRepository';
import { OrderItemsPhases, Prisma } from '@prisma/client';
import { prisma } from '@shared/infra/prisma/prisma';

class OrderItemPhasesRepository implements IOrderItemPhasesRepository {
  public async findById(id: string): Promise<OrderItemsPhases | undefined> {
    const orderItemPhases = await prisma.orderItemsPhases.findUnique({
      where: { id },
    });

    return orderItemPhases;
  }

  public async list(orderItemsId: string): Promise<OrderItemsPhases[]> {
    const orderItemPhasess = await prisma.orderItemsPhases.findMany({
      where: {
        orderItemsId,
      },
    });

    return orderItemPhasess;
  }

  public async create(
    orderItemPhasesData: Prisma.OrderItemsPhasesUncheckedCreateInput,
  ): Promise<OrderItemsPhases> {
    const orderItemPhases = await prisma.orderItemsPhases.create({
      data: orderItemPhasesData,
    });

    return orderItemPhases;
  }

  public async save(
    orderItemPhases: OrderItemsPhases,
  ): Promise<OrderItemsPhases> {
    const orderItemsPhasesUpdated = await prisma.orderItemsPhases.update({
      where: {
        id: orderItemPhases.id,
      },
      data: {
        phaseDate: orderItemPhases.phaseDate,
        phaseId: orderItemPhases.phaseId,
        notes: orderItemPhases.notes,
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

export default OrderItemPhasesRepository;
