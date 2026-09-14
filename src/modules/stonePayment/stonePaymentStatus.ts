/**
 * Estados de um pedido de pagamento na SmartPOS.
 *
 * Ficam num arquivo só porque três camadas precisam da mesma lista: a
 * validação das rotas (celebrate), a regra de idempotência do PATCH e a
 * expiração preguiçosa.
 */
export const STONE_PAYMENT_STATUSES = [
  'pending',
  'sent_to_terminal',
  'approved',
  'declined',
  'canceled',
  'expired',
  'error',
] as const;

export type StonePaymentStatus = typeof STONE_PAYMENT_STATUSES[number];

/**
 * Status finais: o pedido não muda mais. Um PATCH em cima de um deles é
 * ignorado (o app pode reenviar o mesmo resultado depois de uma queda de rede).
 */
export const STONE_PAYMENT_FINAL_STATUSES: StonePaymentStatus[] = [
  'approved',
  'declined',
  'canceled',
  'expired',
  'error',
];

export function isFinalStatus(status: string): boolean {
  return STONE_PAYMENT_FINAL_STATUSES.includes(status as StonePaymentStatus);
}

export const STONE_TRANSACTION_TYPES = [
  'DEBIT',
  'CREDIT',
  'VOUCHER',
  'INSTANT_PAYMENT',
] as const;

export const STONE_INSTALLMENT_TYPES = ['MERCHANT', 'ISSUER', 'NONE'] as const;

/**
 * O que o pedido manda a maquininha fazer. Um estorno ("cancellation") usa a
 * mesma fila e o mesmo fluxo de status do pagamento; a diferença é o Deeplink
 * que o app dispara (cancel-app://cancel com o atk do pagamento original).
 */
export const STONE_OPERATIONS = ['payment', 'cancellation'] as const;

export type StoneOperation = typeof STONE_OPERATIONS[number];

/**
 * Estorno que ainda conta como "existente" para o pagamento alvo: em
 * andamento ou já aprovado. Um estorno negado/expirado/cancelado/com erro não
 * bloqueia uma nova tentativa.
 */
export const STONE_ACTIVE_CANCELLATION_STATUSES: StonePaymentStatus[] = [
  'pending',
  'sent_to_terminal',
  'approved',
];

/**
 * attended: cobrança de balcão — o app dispara sozinho ao ver na fila do
 * terminal. detached: card de cobrança (delivery) — fica numa lista por
 * customer e só cobra no toque do entregador.
 */
export const STONE_MODES = ['attended', 'detached'] as const;

export type StoneMode = typeof STONE_MODES[number];

/** Default e teto do prazo de validade do pedido, em minutos. */
export const DEFAULT_EXPIRES_IN_MINUTES = 7;
/** Balcão: o cliente está na frente da maquininha. */
export const MAX_EXPIRES_IN_MINUTES = 182;
/** Card de delivery: pode esperar a rota inteira (24h). */
export const MAX_DETACHED_EXPIRES_IN_MINUTES = 1440;
/** Tamanho máximo do texto que o entregador vê na lista de cards. */
export const MAX_CARD_DESCRIPTION_LENGTH = 120;
