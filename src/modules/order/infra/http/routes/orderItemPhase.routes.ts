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
      orderItemId: Joi.string().required(),
      employeeId: Joi.string().required(),
      phaseDate: Joi.date().required(),
      phaseId: Joi.string().required(),
      notes: Joi.string().required(),
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
      orderItemId: Joi.string().required(),
      employeeId: Joi.string().required(),
      phaseDate: Joi.date().required(),
      phaseId: Joi.string().required(),
      notes: Joi.string().required(),
    },
  }),
  orderItemPhaseController.update,
);

orderItemPhaseRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      orderItemId: Joi.string().uuid().required(),
    },
  }),
  orderItemPhaseController.list,
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
