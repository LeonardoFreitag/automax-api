import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import UsersController from '@modules/users/infra/http/controllers/UserControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const usersRouter = Router();

const usersController = new UsersController();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      customerId: Joi.string().required(),
      isAdmin: Joi.boolean().required(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      cellphone: Joi.string().empty(''),
      password: Joi.string().required(),
      regionId: Joi.string().required(),
      UserRules: Joi.array().required(),
    },
  }),
  usersController.create,
);

usersRouter.post(
  '/rule',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      userId: Joi.string().required(),
      rule: Joi.string().required(),
    },
  }),
  usersController.createRule,
);

usersRouter.patch(
  '/',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      customerId: Joi.string().required(),
      isAdmin: Joi.boolean().required(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      cellphone: Joi.string().empty(''),
      password: Joi.string().required(),
      regionId: Joi.string().required(),
      rules: Joi.array().required(),
    },
  }),
  usersController.update,
);

usersRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
    },
  }),
  usersController.list,
);

usersRouter.delete(
  '/',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  usersController.delete,
);

usersRouter.delete(
  '/rule',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  usersController.deleteRule,
);

export default usersRouter;
