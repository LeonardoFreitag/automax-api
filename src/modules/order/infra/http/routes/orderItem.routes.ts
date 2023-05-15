import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import OrderItemControllers from '@modules/order/infra/http/controllers/OrderItemControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const orderItemRouter = Router();

const orderItemController = new OrderItemControllers();

orderItemRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      orderId: Joi.string().required(),
      productId: Joi.string().required(),
      saleId: Joi.string().required(),
      description: Joi.string().required(),
      phases: Joi.array().required(),
    },
  }),
  orderItemController.create,
);

orderItemRouter.patch(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      orderId: Joi.string().required(),
      productId: Joi.string().required(),
      saleId: Joi.string().required(),
      description: Joi.string().required(),
    },
  }),
  orderItemController.update,
);

orderItemRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      orderId: Joi.string().uuid().required(),
    },
  }),
  orderItemController.list,
);

orderItemRouter.delete(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  orderItemController.delete,
);

export default orderItemRouter;
