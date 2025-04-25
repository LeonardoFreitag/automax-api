import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import OrderItemPhaseControllers from '@modules/order/infra/http/controllers/OrderItemPhaseControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const orderItemPhaseRouter = Router();

const orderItemPhaseController = new OrderItemPhaseControllers();

orderItemPhaseRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      orderId: Joi.string().required(),
      employeeId: Joi.string().required(),
      employeeName: Joi.string().required(),
      phaseDate: Joi.date().required(),
      phaseId: Joi.string().required(),
      phaseName: Joi.string().required(),
      notes: Joi.string().empty('').default(''),
    },
  }),
  orderItemPhaseController.create,
);

orderItemPhaseRouter.patch(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      orderId: Joi.string().required(),
      employeeId: Joi.string().required(),
      employeeName: Joi.string().required(),
      phaseDate: Joi.date().required(),
      phaseId: Joi.string().required(),
      phaseName: Joi.string().required(),
      notes: Joi.string().empty('').default(''),
    },
  }),
  orderItemPhaseController.update,
);

orderItemPhaseRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      orderId: Joi.string().uuid().required(),
    },
  }),
  orderItemPhaseController.list,
);

orderItemPhaseRouter.get(
  '/today',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      dateCapture: Joi.string().required(),
    },
  }),
  orderItemPhaseController.listToday,
);

orderItemPhaseRouter.get(
  '/todayByCustomerId',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().required(),
      dateCapture: Joi.string().required(),
    },
  }),
  orderItemPhaseController.listTodayByCustomerId,
);

orderItemPhaseRouter.delete(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  orderItemPhaseController.delete,
);

export default orderItemPhaseRouter;
