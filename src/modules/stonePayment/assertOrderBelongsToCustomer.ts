import { StonePaymentOrder } from '@prisma/client';
import AppError from '@shared/errors/AppError';

/**
 * Isolamento entre customers.
 *
 * O `customerId` usado aqui vem sempre do token (resolvido pelo
 * `ensureAuthenticated`), nunca do corpo da requisição: o PDV e o app Android
 * são instalações em campo e não são fonte confiável de qual cliente eles são.
 *
 * Sem isso, um `id` vazado (ou chutado) de outro customer daria acesso ao
 * resultado da transação — e, no PATCH, permitiria gravar em cima dele.
 */
export default function assertOrderBelongsToCustomer(
  order: StonePaymentOrder | undefined,
  customerId: string,
): StonePaymentOrder {
  if (!order) {
    throw new AppError('Pedido de pagamento não encontrado', 404);
  }

  if (!customerId || order.customerId !== customerId) {
    throw new AppError(
      'Este pedido de pagamento pertence a outro customer.',
      403,
    );
  }

  return order;
}
