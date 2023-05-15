import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ClientController from '@modules/client/infra/http/controllers/ClientControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const clientRouter = Router();

const clientController = new ClientController();

clientRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      customerId: Joi.string().required(),
      code: Joi.string().required(),
      companyName: Joi.string().required(),
      comercialName: Joi.string().required(),
      streetName: Joi.string().required(),
      streetNumber: Joi.string().required(),
      neighborhood: Joi.string().required(),
      complement: Joi.string().required(),
      cnpj: Joi.string().required(),
      ie: Joi.string().required(),
      cityCode: Joi.string().required(),
      city: Joi.string().required(),
      stateCode: Joi.string().required(),
      state: Joi.string().required(),
      contacts: Joi.array().required(),
      financialPendency: Joi.bool().required(),
      paymentForm: Joi.array().required(),
      isNew: Joi.bool().required(),
    },
  }),
  clientController.create,
);

clientRouter.patch(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      customerId: Joi.string().required(),
      code: Joi.string().required(),
      companyName: Joi.string().required(),
      comercialName: Joi.string().required(),
      streetName: Joi.string().required(),
      streetNumber: Joi.string().required(),
      neighborhood: Joi.string().required(),
      complement: Joi.string().required(),
      cnpj: Joi.string().required(),
      ie: Joi.string().required(),
      cityCode: Joi.string().required(),
      city: Joi.string().required(),
      stateCode: Joi.string().required(),
      state: Joi.string().required(),
      contacts: Joi.array().required(),
      financialPendency: Joi.boolean().required(),
      paymentForm: Joi.array().required(),
      isNew: Joi.bool().required(),
    },
  }),
  clientController.update,
);

clientRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
    },
  }),
  clientController.list,
);

clientRouter.delete(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  clientController.delete,
);

export default clientRouter;
