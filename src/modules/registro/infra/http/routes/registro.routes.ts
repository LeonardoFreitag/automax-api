import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import RegistroControllers from '@modules/registro/infra/http/controllers/RegistroControllers';
// import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const registroRouter = Router();

const registroController = new RegistroControllers();

registroRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      validade: Joi.string().required(),
    },
  }),
  registroController.create,
);

registroRouter.patch(
  '/',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      validade: Joi.string().required(),
    },
  }),
  registroController.update,
);

registroRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().required(),
    },
  }),
  registroController.showValidade,
);

registroRouter.get('/list', registroController.list);

registroRouter.delete(
  '/',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().required(),
    },
  }),
  registroController.delete,
);

export default registroRouter;
