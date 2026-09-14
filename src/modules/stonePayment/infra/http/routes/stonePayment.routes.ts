import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import StonePaymentControllers from '@modules/stonePayment/infra/http/controllers/StonePaymentControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import {
  DEFAULT_EXPIRES_IN_MINUTES,
  MAX_CARD_DESCRIPTION_LENGTH,
  MAX_DETACHED_EXPIRES_IN_MINUTES,
  STONE_INSTALLMENT_TYPES,
  STONE_MODES,
  STONE_OPERATIONS,
  STONE_PAYMENT_STATUSES,
  STONE_TRANSACTION_TYPES,
} from '@modules/stonePayment/stonePaymentStatus';

const stonePaymentRouter = Router();

const stonePaymentController = new StonePaymentControllers();

// PDV cria o pedido de pagamento (ou de estorno) na maquininha
stonePaymentRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      // Opcional e apenas conferido: o customer efetivo vem do token. Continua
      // aceito para não quebrar o PDV que já manda o campo.
      customerId: Joi.string().optional(),
      terminalId: Joi.string().required(),
      externalRef: Joi.string().required(),
      amountCents: Joi.number().integer().positive().required(),
      // payment (default) | cancellation (estorno de um pagamento aprovado)
      operation: Joi.string()
        .valid(...STONE_OPERATIONS)
        .default('payment'),
      // attended (default, balcão) | detached (card de cobrança / delivery).
      // As regras cruzadas (description obrigatória no detached, detached só
      // com payment, teto de expiração por mode) ficam no service, com 422.
      mode: Joi.string()
        .valid(...STONE_MODES)
        .default('attended'),
      description: Joi.string()
        .trim()
        .max(MAX_CARD_DESCRIPTION_LENGTH)
        .allow('')
        .optional(),
      // Estorno: uuid do pagamento aprovado. Validado no service (existe, é do
      // mesmo customer, está aprovado, tem atk) com 422 — aqui só a presença,
      // sem `.uuid()`, para que um id inexistente também caia no 422 e não num
      // 400 de formato.
      targetPaymentId: Joi.string().when('operation', {
        is: 'cancellation',
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      }),
      // Só faz sentido no pagamento. No estorno, o service copia do pagamento
      // alvo e o que vier no corpo é ignorado (o PDV não precisa mandar).
      transactionType: Joi.string()
        .valid(...STONE_TRANSACTION_TYPES)
        .when('operation', {
          is: 'cancellation',
          then: Joi.optional(),
          otherwise: Joi.required(),
        }),
      installmentType: Joi.string().valid(...STONE_INSTALLMENT_TYPES),
      // Parcelamento só existe quando quem parcela é a loja ou o emissor.
      installmentCount: Joi.number()
        .integer()
        .min(2)
        .max(12)
        .when('installmentType', {
          is: Joi.valid('MERCHANT', 'ISSUER'),
          otherwise: Joi.forbidden(),
        }),
      // Teto real depende do mode (182 no balcão, 1440 no card) e é aplicado
      // no service com 422; aqui só o limite absoluto.
      expiresInMinutes: Joi.number()
        .integer()
        .min(1)
        .max(MAX_DETACHED_EXPIRES_IN_MINUTES)
        .default(DEFAULT_EXPIRES_IN_MINUTES),
    },
  }),
  stonePaymentController.create,
);

// Fila do app Android. Declarada antes de "/:id" para que "pending" não seja
// confundido com um id.
stonePaymentRouter.get(
  '/pending',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      terminalId: Joi.string().required(),
    },
  }),
  stonePaymentController.listPending,
);

// Lista de cards de cobrança (delivery) do customer do token. Sem terminalId
// de propósito: qualquer maquininha do cliente pode cobrar qualquer card.
// Também antes de "/:id".
stonePaymentRouter.get(
  '/cards',
  ensureAuthenticated,
  stonePaymentController.listCards,
);

// PDV consulta o status
stonePaymentRouter.get(
  '/:id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  stonePaymentController.show,
);

// PDV desiste da cobrança
stonePaymentRouter.post(
  '/:id/cancel',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  stonePaymentController.cancel,
);

// PDV fecha a venda com um card pago (só uma venda por card)
stonePaymentRouter.post(
  '/:id/consume',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      consumedBySale: Joi.string().trim().min(1).max(60).required(),
    },
  }),
  stonePaymentController.consume,
);

// app Android grava o andamento e o resultado da Stone
stonePaymentRouter.patch(
  '/:id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    // `.unknown(true)`: o corpo do resultado é escrito pela maquininha, e o
    // conjunto de campos que a Stone devolve varia por modalidade (o retorno de
    // Pix, por exemplo, não está documentado). Recusar um campo novo aqui
    // significaria perder o resultado de um pagamento já efetuado — o pedido
    // ficaria preso em "sent_to_terminal" com o cliente tendo pago. O que não
    // está previsto é preservado dentro de `rawResponse` pelo service.
    [Segments.BODY]: Joi.object({
      status: Joi.string()
        .valid(...STONE_PAYMENT_STATUSES)
        .required(),
      authorizationCode: Joi.string().allow('').optional(),
      brand: Joi.string().allow('').optional(),
      atk: Joi.string().allow('').optional(),
      itk: Joi.string().allow('').optional(),
      // Nunca o PAN completo: no máximo os 4 últimos dígitos mascarados.
      panMasked: Joi.string().allow('').max(30).optional(),
      entryMode: Joi.string().allow('').optional(),
      cardholderName: Joi.string().allow('').optional(),
      // O que foi de fato cobrado (card de delivery: o entregador pode ter
      // trocado a pré-seleção). Sobrescreve o que o PDV mandou no POST.
      transactionType: Joi.string()
        .valid(...STONE_TRANSACTION_TYPES)
        .optional(),
      installmentType: Joi.string()
        .valid(...STONE_INSTALLMENT_TYPES)
        .optional(),
      installmentCount: Joi.number().integer().min(1).max(12).optional(),
      rawResponse: Joi.any().optional(),
    }).unknown(true),
  }),
  stonePaymentController.update,
);

export default stonePaymentRouter;
