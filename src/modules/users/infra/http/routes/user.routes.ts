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
      isCommissioned: Joi.boolean().required(),
      comissionPercentage: Joi.number().required(),
      rules: Joi.array().required(),
    },
  }),
  usersController.create,
);

usersRouter.patch(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      customerId: Joi.string().required(),
      isAdmin: Joi.boolean().required(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      cellphone: Joi.string().empty(''),
      password: Joi.string().required(),
      isCommissioned: Joi.boolean().required(),
      comissionPercentage: Joi.number().required(),
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

export default usersRouter;
