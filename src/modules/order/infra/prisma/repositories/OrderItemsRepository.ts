import IOrderItemsRepository from '@modules/order/repositories/IOrderItemsRepository';
import { OrderItems, Prisma } from '@prisma/client';
import { prisma } from '@shared/infra/prisma/prisma';

class OrderItemsRepository implements IOrderItemsRepository {
  public async findById(id: string): Promise<OrderItems | undefined> {
    const orderItems = prisma.orderItems.findUnique({
      where: { id },
      include: { OrderItemsPhases: true },
    });

    return orderItems;
  }

  public async list(orderId: string): Promise<OrderItems[]> {
    const orderItemss = await prisma.orderItems.findMany({
      where: {
        orderId,
      },
      include: { OrderItemsPhases: true },
    });

    return orderItemss;
  }

  public async create(
    orderItemsData: Prisma.OrderItemsUncheckedCreateInput,
  ): Promise<OrderItems> {
    const orderItems = await prisma.orderItems.create({
      data: {
        ...orderItemsData,
        OrderItemsPhases: {
          createMany: {
            data: orderItemsData.OrderItemsPhases as Prisma.OrderItemsPhasesUncheckedCreateInput,
          },
        },
      },
    });

    return orderItems;
  }

  public async save(orderItems: OrderItems): Promise<OrderItems> {
    const updatedOrderIem = await prisma.orderItems.update({
      where: {
        id: orderItems.id,
      },
      data: {
        description: orderItems.description,
      },
    });
    return updatedOrderIem;
  }

  public async delete(id: string): Promise<void> {
    await prisma.orderItems.delete({
      where: {
        id,
      },
    });
  }
}

export default OrderItemsRepository;
