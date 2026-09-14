import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateStonePaymentOrderService from '@modules/stonePayment/services/CreateStonePaymentOrderService';
import ShowStonePaymentOrderService from '@modules/stonePayment/services/ShowStonePaymentOrderService';
import CancelStonePaymentOrderService from '@modules/stonePayment/services/CancelStonePaymentOrderService';
import ListPendingStonePaymentOrdersService from '@modules/stonePayment/services/ListPendingStonePaymentOrdersService';
import UpdateStonePaymentOrderService from '@modules/stonePayment/services/UpdateStonePaymentOrderService';
import ListStonePaymentCardsService from '@modules/stonePayment/services/ListStonePaymentCardsService';
import ConsumeStonePaymentOrderService from '@modules/stonePayment/services/ConsumeStonePaymentOrderService';
import AppError from '@shared/errors/AppError';

/**
 * O customer vem sempre do token (ensureAuthenticated), nunca do corpo ou da
 * query: PDV e SmartPOS são instalações em campo e não são fonte confiável de
 * qual cliente elas são.
 */
function customerIdFromToken(request: Request): string {
  const { customerId } = request.user;

  if (!customerId) {
    throw new AppError('Token sem customer associado.', 403);
  }

  return customerId;
}

export default class StonePaymentController {
  // PDV cria o pedido de pagamento e passa a fazer polling do status
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      customerId: bodyCustomerId,
      terminalId,
      externalRef,
      amountCents,
      operation,
      mode,
      description,
      targetPaymentId,
      transactionType,
      installmentType,
      installmentCount,
      expiresInMinutes,
    } = request.body;

    const createStonePaymentOrder = container.resolve(
      CreateStonePaymentOrderService,
    );

    const stonePaymentOrder = await createStonePaymentOrder.execute({
      customerId: customerIdFromToken(request),
      bodyCustomerId,
      terminalId,
      externalRef,
      amountCents,
      operation,
      mode,
      description,
      targetPaymentId,
      transactionType,
      installmentType,
      installmentCount,
      expiresInMinutes,
    });

    return response.json(stonePaymentOrder);
  }

  // PDV consulta o status (polling ~2,5s); expira o pendente vencido na leitura
  public async show(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);

    const showStonePaymentOrder = container.resolve(
      ShowStonePaymentOrderService,
    );

    const stonePaymentOrder = await showStonePaymentOrder.execute(
      id,
      customerIdFromToken(request),
    );

    return response.json(stonePaymentOrder);
  }

  // PDV desiste da cobrança
  public async cancel(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);

    const cancelStonePaymentOrder = container.resolve(
      CancelStonePaymentOrderService,
    );

    const { stonePaymentOrder, canceled } =
      await cancelStonePaymentOrder.execute(id, customerIdFromToken(request));

    // Já estava em status final: devolve o registro atual com 409 para o PDV
    // mostrar o desfecho real em vez de assumir que cancelou.
    if (!canceled) {
      return response.status(409).json(stonePaymentOrder);
    }

    return response.json(stonePaymentOrder);
  }

  // app Android consome a fila do seu terminal (polling ~2s)
  public async listPending(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { terminalId } = request.query;

    const listPendingStonePaymentOrders = container.resolve(
      ListPendingStonePaymentOrdersService,
    );

    const stonePaymentOrders = await listPendingStonePaymentOrders.execute(
      customerIdFromToken(request),
      String(terminalId),
    );

    return response.json(stonePaymentOrders);
  }

  // PDV fecha a venda com um card pago: marca o pagamento como consumido
  public async consume(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const id = String(request.params.id);
    const { consumedBySale } = request.body;

    const consumeStonePaymentOrder = container.resolve(
      ConsumeStonePaymentOrderService,
    );

    const stonePaymentOrder = await consumeStonePaymentOrder.execute({
      id,
      customerId: customerIdFromToken(request),
      consumedBySale: String(consumedBySale),
    });

    return response.json(stonePaymentOrder);
  }

  // app Android lista os cards de cobrança (delivery) do customer — nada
  // aqui dispara sozinho; o entregador toca para cobrar
  public async listCards(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const listStonePaymentCards = container.resolve(
      ListStonePaymentCardsService,
    );

    const cards = await listStonePaymentCards.execute(
      customerIdFromToken(request),
    );

    return response.json(cards);
  }

  // app Android marca "sent_to_terminal" e depois grava o resultado da Stone
  public async update(request: Request, response: Response): Promise<Response> {
    const id = String(request.params.id);
    const {
      status,
      authorizationCode,
      brand,
      atk,
      itk,
      panMasked,
      entryMode,
      cardholderName,
      transactionType,
      installmentType,
      installmentCount,
      rawResponse,
      // Qualquer campo que a maquininha devolva e que ainda não tenha coluna
      // (o retorno de Pix é o caso concreto) chega aqui e é guardado dentro do
      // rawResponse em vez de derrubar a requisição.
      ...extraFields
    } = request.body;

    const updateStonePaymentOrder = container.resolve(
      UpdateStonePaymentOrderService,
    );

    const { stonePaymentOrder, claimConflict } =
      await updateStonePaymentOrder.execute({
        id,
        customerId: customerIdFromToken(request),
        status,
        authorizationCode,
        brand,
        atk,
        itk,
        panMasked,
        entryMode,
        cardholderName,
        transactionType,
        installmentType,
        installmentCount,
        rawResponse,
        extraFields,
      });

    // Card já tirado de "pending" por outra maquininha: o app mostra "sendo
    // cobrado em outra maquineta" a partir do pedido atual.
    if (claimConflict) {
      return response.status(409).json(stonePaymentOrder);
    }

    return response.json(stonePaymentOrder);
  }
}
