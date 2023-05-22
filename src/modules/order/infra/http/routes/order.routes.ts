import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import OrderControllers from '@modules/order/infra/http/controllers/OrderControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const orderRouter = Router();

const orderController = new OrderControllers();

orderRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      customerId: Joi.string().required(),
      orderNumber: Joi.string().required(),
      userId: Joi.string().required(),
      orderDate: Joi.date().required(),
      description: Joi.string().required(),
      notes: Joi.string().required(),
      finished: Joi.bool().required(),
      canceled: Joi.bool().required(),
      OrderItems: Joi.array().required(),
    },
  }),
  orderController.create,
);

orderRouter.patch(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      customerId: Joi.string().required(),
      orderNumber: Joi.string().required(),
      userId: Joi.string().required(),
      orderDate: Joi.date().required(),
      description: Joi.string().required(),
      notes: Joi.string().required(),
      finished: Joi.bool().required(),
      canceled: Joi.bool().required(),
    },
  }),
  orderController.update,
);

orderRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
    },
  }),
  orderController.list,
);

orderRouter.delete(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  orderController.delete,
);

export default orderRouter;
