import IOrderRepository from '@modules/order/repositories/IOrderRepository';
import { prisma } from '@shared/infra/prisma/prisma';
import { Order, Prisma } from '@prisma/client';

class OrderRepository implements IOrderRepository {
  public async findById(id: string): Promise<Order | undefined> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        OrderItems: {
          include: {
            OrderItemsPhases: true,
          },
        },
      },
    });

    return order;
  }

  public async findByOrderNumber(
    orderNumber: string,
  ): Promise<Order | undefined> {
    const order = await prisma.order.findFirst({
      where: { orderNumber },
      include: {
        OrderItems: {
          include: {
            OrderItemsPhases: true,
          },
        },
      },
    });

    return order;
  }

  public async list(customerId: string): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: {
        customerId,
      },
      include: {
        OrderItems: {
          include: {
            OrderItemsPhases: true,
          },
        },
      },
    });

    return orders;
  }

  public async create(
    orderData: Prisma.OrderUncheckedCreateInput,
  ): Promise<Order> {
    const order = await prisma.order.create({
      data: {
        ...orderData,
        OrderItems: {
          createMany: {
            data: orderData.OrderItems as Prisma.OrderItemsUncheckedCreateInput,
          },
        },
      },
    });

    return order;
  }

  public async save(order: Order): Promise<Order> {
    const updatedOrder = await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        userId: order.userId,
        orderDate: order.orderDate,
        description: order.description,
        notes: order.notes,
        finished: order.finished,
        canceled: order.canceled,
      },
    });
    return updatedOrder;
  }

  public async delete(id: string): Promise<void> {
    await prisma.order.delete({
      where: {
        id,
      },
    });
  }
}

export default OrderRepository;
