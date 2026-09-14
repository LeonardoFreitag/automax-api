import { Prisma, StonePaymentOrder } from '@prisma/client';

export default interface IStonePaymentRepository {
  create(
    data: Prisma.StonePaymentOrderUncheckedCreateInput,
  ): Promise<StonePaymentOrder>;
  findById(id: string): Promise<StonePaymentOrder | undefined>;
  /**
   * Fila do app Android: pendentes ainda válidos daquele terminal, mais os que
   * já foram entregues ao terminal e receberam pedido de cancelamento.
   *
   * Sempre dentro de um customer: terminalId é string configurada à mão no
   * aparelho e pode repetir entre clientes diferentes.
   *
   * Só mode = attended. O app dispara sozinho o que vier daqui — um card de
   * delivery nesta fila seria cobrado no balcão sem ninguém pedir.
   */
  listPendingByTerminal(
    customerId: string,
    terminalId: string,
  ): Promise<StonePaymentOrder[]>;
  /**
   * Pendentes vencidos de um terminal. Usado pela expiração preguiçosa antes
   * de montar a fila.
   */
  listExpiredPendingByTerminal(
    customerId: string,
    terminalId: string,
  ): Promise<StonePaymentOrder[]>;
  update(
    id: string,
    data: Prisma.StonePaymentOrderUncheckedUpdateInput,
  ): Promise<StonePaymentOrder>;
  /** Marca vários pendentes vencidos de uma vez (expiração preguiçosa). */
  expireMany(ids: string[]): Promise<number>;
  /**
   * Estorno em andamento ou aprovado apontando para este pagamento. Serve
   * para não enfileirar dois estornos do mesmo pagamento.
   */
  findActiveCancellationByTarget(
    targetPaymentId: string,
  ): Promise<StonePaymentOrder | undefined>;

  /**
   * Lista de cards de cobrança do customer (mode = detached), sem filtro de
   * terminal: pending e sent_to_terminal ainda válidos, mais os approved não
   * consumidos (o "PAGO" que o entregador mostra ao cliente).
   */
  listCardsByCustomer(customerId: string): Promise<StonePaymentOrder[]>;
  /** Cards pending vencidos do customer (expiração preguiçosa da lista). */
  listExpiredPendingCardsByCustomer(
    customerId: string,
  ): Promise<StonePaymentOrder[]>;
  /**
   * Compare-and-set: só muda o status se o atual for `fromStatus`. Devolve
   * false quando outra maquininha chegou antes.
   */
  transitionStatus(
    id: string,
    fromStatus: string,
    toStatus: string,
  ): Promise<boolean>;
  /**
   * Compare-and-set do consumo: só marca se ainda não consumido. Devolve
   * false quando outra venda consumiu antes.
   */
  consume(id: string, consumedBySale: string): Promise<boolean>;
}
