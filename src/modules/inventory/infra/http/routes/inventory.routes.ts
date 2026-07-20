import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import InventoryController from '@modules/inventory/infra/http/controllers/InventoryControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const inventoryRouter = Router();

const inventoryController = new InventoryController();

// inicia um novo inventário (status "em_andamento")
inventoryRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      customerId: Joi.string().required(),
      userId: Joi.string().required(),
      userName: Joi.string().required(),
    },
  }),
  inventoryController.create,
);

// adiciona um item contado (produto + quantidade encontrada)
inventoryRouter.post(
  '/item',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      inventoryId: Joi.string().required(),
      stockProductId: Joi.string().required(),
      code: Joi.string().required(),
      reference: Joi.string().required(),
      description: Joi.string().required(),
      unity: Joi.string().required(),
      quantity: Joi.number().required(),
    },
  }),
  inventoryController.createItem,
);

// lista inventários do customer. downloaded=false é a consulta usada pelo ERP
inventoryRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
      downloaded: Joi.boolean().optional(),
    },
  }),
  inventoryController.list,
);

inventoryRouter.get(
  '/item',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      inventoryId: Joi.string().uuid().required(),
    },
  }),
  inventoryController.listItems,
);

// usuário finaliza a contagem no app
inventoryRouter.patch(
  '/status',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      status: Joi.string().valid('em_andamento', 'finalizado').required(),
    },
  }),
  inventoryController.updateStatus,
);

// ERP marca como processado depois de gravar no Firebird e atualizar o estoque
inventoryRouter.patch(
  '/downloaded',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
      downloaded: Joi.boolean().required(),
    },
  }),
  inventoryController.changeDownloaded,
);

inventoryRouter.delete(
  '/item',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  inventoryController.deleteItem,
);

export default inventoryRouter;
