import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import StockProductController from '@modules/stockProduct/infra/http/controllers/StockProductControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const stockProductRouter = Router();

const stockProductController = new StockProductController();

// ERP AutoMax envia aqui a lista de matéria-prima (código, referência,
// descrição, unidade). Segue o mesmo padrão de "upsert por substituição"
// já usado no cadastro de produtos de venda: se já existir um StockProduct
// com o mesmo "code" para o customerId, ele é removido e recriado.
stockProductRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      customerId: Joi.string().required(),
      code: Joi.string().required(),
      reference: Joi.string().required(),
      description: Joi.string().required(),
      unity: Joi.string().required(),
    },
  }),
  stockProductController.create,
);

stockProductRouter.patch(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      customerId: Joi.string().required(),
      code: Joi.string().required(),
      reference: Joi.string().required(),
      description: Joi.string().required(),
      unity: Joi.string().required(),
    },
  }),
  stockProductController.update,
);

stockProductRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
    },
  }),
  stockProductController.list,
);

// busca por código, referência ou descrição (tela de seleção do app)
stockProductRouter.get(
  '/search',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
      search: Joi.string().allow('').required(),
    },
  }),
  stockProductController.search,
);

// leitura de QR code: o QR guarda o valor do campo "reference"
stockProductRouter.get(
  '/reference',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
      reference: Joi.string().required(),
    },
  }),
  stockProductController.findByReference,
);

stockProductRouter.delete(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  stockProductController.delete,
);

export default stockProductRouter;
