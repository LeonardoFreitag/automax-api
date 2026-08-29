import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import UsersController from '@modules/users/infra/http/controllers/UserControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const usersRouter = Router();

const usersController = new UsersController();

usersRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().allow(null),
      customerId: Joi.string().required(),
      isAdmin: Joi.boolean().required(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      cellphone: Joi.string().empty('').default(''),
      password: Joi.string().empty('').default('123456'),
      regionId: Joi.string().empty('').default(''),
      routeId: Joi.string().empty('').default(''),
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
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      customerId: Joi.string().required(),
      isAdmin: Joi.boolean().required(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      cellphone: Joi.string().empty('').default(''),
      password: Joi.string().empty('').default('123456'),
      regionId: Joi.string().empty('').default(''),
      routeId: Joi.string().empty('').default(''),
      rules: Joi.array().required(),
    },
  }),
  usersController.update,
);

/**
 * Ativa/desativa o vendedor. Mesmo contrato de PATCH /client/status.
 *
 * Desativar bloqueia o login, invalida o token em uso e recusa novos pedidos,
 * sem apagar cadastro nem histórico.
 */
usersRouter.patch(
  '/status',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
      isActivated: Joi.boolean().required(),
    },
  }),
  usersController.changeStatus,
);

usersRouter.patch(
  '/updaterUserAdmin',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().required(),
      old_email: Joi.string().email().required(),
      new_email: Joi.string().email().required(),
    },
  }),
  usersController.updateEmailUserAdmin,
);

usersRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
    },
  }),
  usersController.list,
);

usersRouter.get(
  '/rule',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
      rule: Joi.string().required(),
    },
  }),
  usersController.listByRule,
);

usersRouter.delete(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  usersController.delete,
);

usersRouter.delete(
  '/rule',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  usersController.deleteRule,
);

usersRouter.get(
  '/email',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      email: Joi.string().email().required(),
    },
  }),
  usersController.listByEmail,
);

usersRouter.post(
  '/deduplicate',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
      email: Joi.string().email().required(),
    },
  }),
  usersController.deduplicateUser,
);

export default usersRouter;
