import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import SessionsController from '@modules/users/infra/http/controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string(),
    },
  }),
  sessionsController.create,
);

sessionsRouter.post(
  '/refreshToken',
  celebrate({
    [Segments.BODY]: {
      refreshToken: Joi.string(),
    },
  }),
  sessionsController.refresh,
);

export default sessionsRouter;
