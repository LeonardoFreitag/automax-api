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
      orderId: Joi.string().required(),
      orderDate: Joi.string().required(),
      orderNumber: Joi.string().required(),
      description: Joi.string().required(),
      notes: Joi.string().empty('').default(''),
      status: Joi.string().required(),
      tagId: Joi.string().required(),
      tagProductId: Joi.string().required(),
      tagReference: Joi.string().required(),
      tagProductName: Joi.string().required(),
      tagTissueName: Joi.string().empty('').default(''),
      tagSellerName: Joi.string().empty('').default(''),
      tagStatus: Joi.string().empty('').default(''),
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
      orderId: Joi.string().required(),
      orderDate: Joi.string().required(),
      orderNumber: Joi.string().required(),
      description: Joi.string().required(),
      notes: Joi.string().required(),
      status: Joi.string().required(),
      tagId: Joi.string().required(),
      tagProductId: Joi.string().required(),
      tagReference: Joi.string().required(),
      tagProductName: Joi.string().required(),
      tagTissueName: Joi.string().required(),
      tagSellerName: Joi.string().required(),
      tagStatus: Joi.string().required(),
    },
  }),
  orderController.update,
);

orderRouter.patch(
  '/finalize',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().required(),
      status: Joi.string().required(),
    },
  }),
  orderController.finalize,
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

orderRouter.get(
  '/employeeId',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
      employeeId: Joi.string().uuid().required(),
    },
  }),
  orderController.listByEmployeeId,
);

orderRouter.get(
  '/tagId',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
      tagId: Joi.string().required(),
    },
  }),
  orderController.findByTagId,
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
