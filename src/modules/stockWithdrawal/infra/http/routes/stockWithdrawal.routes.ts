import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import StockWithdrawalController from '@modules/stockWithdrawal/infra/http/controllers/StockWithdrawalControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const stockWithdrawalRouter = Router();

const stockWithdrawalController = new StockWithdrawalController();

// inicia uma nova baixa de estoque (status "em_andamento")
stockWithdrawalRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      customerId: Joi.string().required(),
      userId: Joi.string().required(),
      userName: Joi.string().required(),
      notes: Joi.string().allow('').optional(),
    },
  }),
  stockWithdrawalController.create,
);

// adiciona um item retirado (produto + quantidade retirada)
stockWithdrawalRouter.post(
  '/item',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      stockWithdrawalId: Joi.string().required(),
      stockProductId: Joi.string().required(),
      code: Joi.string().required(),
      reference: Joi.string().required(),
      description: Joi.string().required(),
      unity: Joi.string().required(),
      quantity: Joi.number().required(),
    },
  }),
  stockWithdrawalController.createItem,
);

// lista baixas do customer. downloaded=false é a consulta usada pelo ERP
stockWithdrawalRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
      downloaded: Joi.boolean().optional(),
    },
  }),
  stockWithdrawalController.list,
);

stockWithdrawalRouter.get(
  '/item',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      stockWithdrawalId: Joi.string().uuid().required(),
    },
  }),
  stockWithdrawalController.listItems,
);

// usuário finaliza a baixa no app
stockWithdrawalRouter.patch(
  '/status',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      status: Joi.string().valid('em_andamento', 'finalizado').required(),
    },
  }),
  stockWithdrawalController.updateStatus,
);

// ERP marca como processado depois de gravar no Firebird e dar baixa no estoque
stockWithdrawalRouter.patch(
  '/downloaded',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
      downloaded: Joi.boolean().required(),
    },
  }),
  stockWithdrawalController.changeDownloaded,
);

stockWithdrawalRouter.delete(
  '/item',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  stockWithdrawalController.deleteItem,
);

export default stockWithdrawalRouter;
