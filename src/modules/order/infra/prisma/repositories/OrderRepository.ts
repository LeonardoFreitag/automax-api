import IOrderRepository from '@modules/order/repositories/IOrderRepository';
import { prisma } from '@shared/infra/prisma/prisma';
import { Order, Prisma } from '@prisma/client';

class OrderRepository implements IOrderRepository {
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
      },
      include: {
        OrderItemsPhases: true,
      },
    });
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
    await prisma.order.delete({
      where: {
        id,
      },
    });
  }
}

export default OrderRepository;
