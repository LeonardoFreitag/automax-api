import IOrderRepository from '@modules/order/repositories/IOrderRepository';
import { prisma } from '@shared/infra/prisma/prisma';
import { Order, Prisma } from '@prisma/client';
import AppError from '@shared/errors/AppError';

class OrderRepository implements IOrderRepository {
  public async listByPeriodo(
    customerId: string,
    initialDate: string,
    finalDate: string,
  ): Promise<Order[]> {
    const dateStart = new Date(initialDate);
    const dateEnd = new Date(finalDate);

    dateStart.setHours(0, 0, 0, 0);

    dateEnd.setHours(23, 59, 59, 999);

    const orders = await prisma.order.findMany({
      where: {
        customerId,
        orderDate: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
      include: {
        OrderItemsPhases: true,
      },
      orderBy: {
        orderDate: 'desc',
      },
    });

    return orders;
  }

  public async listByEmployeeId(
    customerId: string,
    employeeId: string,
    initialDate: string,
    finalDate: string,
  ): Promise<Order[]> {
    // console.log('employeeId', employeeId);
    // console.log('customerId', customerId);
    const dateStart = new Date(initialDate);
    const dateEnd = new Date(finalDate);

    dateStart.setHours(0, 0, 0, 0);

    dateEnd.setHours(23, 59, 59, 999);

    const orders = await prisma.order.findMany({
      where: {
        customerId,
        OrderItemsPhases: {
          some: {
            employeeId,
            phaseDate: {
              gte: dateStart,
              lte: dateEnd,
            },
          },
        },
      },
      include: {
        OrderItemsPhases: true,
      },
      orderBy: {
        orderDate: 'desc',
      },
    });

    return orders;
  }

  public async findByTagId(customerId: string, tagId: string): Promise<Order> {
    const order = await prisma.order.findFirst({
      where: {
        customerId,
        tagId,
      },
      include: {
        OrderItemsPhases: true,
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  public async findByCustomerIdAndTagId(
    customerId: string,
    tagId: string,
  ): Promise<Order> {
    const order = await prisma.order.findFirst({
      where: {
        customerId,
        tagId,
        status: 'open',
      },
      include: {
        OrderItemsPhases: true,
      },
    });

    // if (!order) {
    //   throw new AppError('Order not found');
    // }

    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        OrderItemsPhases: true,
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
        OrderItemsPhases: true,
      },
    });

    return order;
  }

  public async list(customerId: string): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: {
        customerId,
        status: 'open',
      },
      include: {
        OrderItemsPhases: true,
      },
    });

    return orders;
  }

  public async create(
    orderData: Prisma.OrderUncheckedCreateInput,
  ): Promise<Order> {
    const order = await prisma.order.create({
      data: orderData,
    });

    return order;
  }

  public async save(order: Order): Promise<Order> {
    const updatedOrder = await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        orderDate: order.orderDate,
        orderNumber: order.orderNumber,
        description: order.description,
        notes: order.notes,
        status: order.status,
        tagId: order.tagId,
        tagProductId: order.tagProductId,
        tagReference: order.tagReference,
        tagProductName: order.tagProductName,
        tagTissueName: order.tagTissueName,
        tagSellerName: order.tagSellerName,
        tagStatus: order.tagStatus,
      },
    });
    return updatedOrder;
  }

  public async delete(id: string): Promise<void> {
    const foundOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!foundOrder) {
      throw new AppError('Order not found', 404);
    }

    await prisma.order.delete({
      where: {
        id,
      },
    });
  }
}

export default OrderRepository;
