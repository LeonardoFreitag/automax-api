import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import GroupControllers from '@modules/group/infra/http/controllers/GroupControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const groupRouter = Router();

const groupController = new GroupControllers();

groupRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      customerId: Joi.string().required(),
      group: Joi.string().required(),
    },
  }),
  groupController.create,
);

groupRouter.patch(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      customerId: Joi.string().required(),
      group: Joi.string().required(),
    },
  }),
  groupController.update,
);

groupRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
    },
  }),
  groupController.list,
);

groupRouter.delete(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  groupController.delete,
);

groupRouter.delete(
  '/all',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
    },
  }),
  groupController.deleteAll,
);

export default groupRouter;
