import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import PhasesControllers from '@modules/phases/infra/http/controllers/PhasesControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const phasesRouter = Router();

const phasesController = new PhasesControllers();

phasesRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      customerId: Joi.string().required(),
      phase: Joi.string().required(),
      orderPhase: Joi.number().required(),
    },
  }),
  phasesController.create,
);

phasesRouter.patch(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      customerId: Joi.string().required(),
      phase: Joi.string().required(),
      orderPhase: Joi.number().required(),
    },
  }),
  phasesController.update,
);

phasesRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().required(),
    },
  }),
  phasesController.list,
);

phasesRouter.delete(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  phasesController.delete,
);

export default phasesRouter;
