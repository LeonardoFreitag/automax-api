import IStonePaymentRepository from '@modules/stonePayment/repositories/IStonePaymentRepository';
import { Prisma, StonePaymentOrder } from '@prisma/client';
import { prisma } from '@shared/infra/prisma/prisma';
import { STONE_ACTIVE_CANCELLATION_STATUSES } from '@modules/stonePayment/stonePaymentStatus';

class StonePaymentRepository implements IStonePaymentRepository {
  public async create(
    data: Prisma.StonePaymentOrderUncheckedCreateInput,
  ): Promise<StonePaymentOrder> {
    const stonePaymentOrder = await prisma.stonePaymentOrder.create({
      data,
    });

    return stonePaymentOrder;
  }

  public async findById(id: string): Promise<StonePaymentOrder | undefined> {
    const stonePaymentOrder = await prisma.stonePaymentOrder.findUnique({
      where: { id },
    });

    return stonePaymentOrder;
  }

  public async listPendingByTerminal(
    customerId: string,
    terminalId: string,
  ): Promise<StonePaymentOrder[]> {
    const stonePaymentOrders = await prisma.stonePaymentOrder.findMany({
      where: {
        customerId,
        terminalId,
        mode: 'attended',
        OR: [
          // Fila normal: ainda não entregue ao terminal e dentro da validade.
          { status: 'pending', expiresAt: { gt: new Date() } },
          // Aviso de cancelamento de algo que o terminal já recebeu.
          { status: 'sent_to_terminal', cancelRequested: true },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    return stonePaymentOrders;
  }

  public async listExpiredPendingByTerminal(
    customerId: string,
    terminalId: string,
  ): Promise<StonePaymentOrder[]> {
    const stonePaymentOrders = await prisma.stonePaymentOrder.findMany({
      where: {
        customerId,
        terminalId,
        mode: 'attended',
        status: 'pending',
        expiresAt: { lte: new Date() },
      },
    });

    return stonePaymentOrders;
  }

  public async update(
    id: string,
    data: Prisma.StonePaymentOrderUncheckedUpdateInput,
  ): Promise<StonePaymentOrder> {
    const stonePaymentOrder = await prisma.stonePaymentOrder.update({
      where: { id },
      data,
    });

    return stonePaymentOrder;
  }

  public async expireMany(ids: string[]): Promise<number> {
    if (ids.length === 0) {
      return 0;
    }

    // O filtro por status repetido aqui evita sobrescrever um pedido que
    // mudou de estado entre a leitura e esta escrita (app respondeu no meio).
    const { count } = await prisma.stonePaymentOrder.updateMany({
      where: { id: { in: ids }, status: 'pending' },
      data: { status: 'expired' },
    });

    return count;
  }

  public async findActiveCancellationByTarget(
    targetPaymentId: string,
  ): Promise<StonePaymentOrder | undefined> {
    const cancellation = await prisma.stonePaymentOrder.findFirst({
      where: {
        operation: 'cancellation',
        targetPaymentId,
        status: { in: STONE_ACTIVE_CANCELLATION_STATUSES },
      },
      orderBy: { createdAt: 'desc' },
    });

    return cancellation;
  }

  public async listCardsByCustomer(
    customerId: string,
  ): Promise<StonePaymentOrder[]> {
    const cards = await prisma.stonePaymentOrder.findMany({
      where: {
        customerId,
        mode: 'detached',
        operation: 'payment',
        OR: [
          // Ainda por cobrar (ou sendo cobrado agora em alguma maquininha).
          {
            status: { in: ['pending', 'sent_to_terminal'] },
            expiresAt: { gt: new Date() },
          },
          // Pago e ainda não fechado na venda: continua na lista como "PAGO".
          { status: 'approved', consumed: false },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return cards;
  }

  public async listExpiredPendingCardsByCustomer(
    customerId: string,
  ): Promise<StonePaymentOrder[]> {
    const cards = await prisma.stonePaymentOrder.findMany({
      where: {
        customerId,
        mode: 'detached',
        status: 'pending',
        expiresAt: { lte: new Date() },
      },
    });

    return cards;
  }

  public async transitionStatus(
    id: string,
    fromStatus: string,
    toStatus: string,
  ): Promise<boolean> {
    const { count } = await prisma.stonePaymentOrder.updateMany({
      where: { id, status: fromStatus },
      data: { status: toStatus },
    });

    return count === 1;
  }

  public async consume(id: string, consumedBySale: string): Promise<boolean> {
    const { count } = await prisma.stonePaymentOrder.updateMany({
      where: { id, status: 'approved', consumed: false },
      data: { consumed: true, consumedBySale, consumedAt: new Date() },
    });

    return count === 1;
  }
}

export default StonePaymentRepository;
