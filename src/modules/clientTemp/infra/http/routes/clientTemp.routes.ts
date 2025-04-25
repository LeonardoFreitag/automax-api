import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ClientTempController from '@modules/clientTemp/infra/http/controllers/ClientTempControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const clientTempRouter = Router();

const clientTempController = new ClientTempController();

clientTempRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      customerId: Joi.string().required(),
      companyName: Joi.string().required(),
      comercialName: Joi.string().empty('').default(''),
      zipCode: Joi.string().empty('').default(''),
      streetName: Joi.string().empty('').default(''),
      streetNumber: Joi.string().empty('').default(''),
      neighborhood: Joi.string().empty('').default(''),
      complement: Joi.string().empty('').default(''),
      cnpj: Joi.string().empty('').default(''),
      ie: Joi.string().empty('').default('isento'),
      cityCode: Joi.string().empty('').default(''),
      city: Joi.string().empty('').default(''),
      stateCode: Joi.string().empty('').default(''),
      state: Joi.string().empty('').default(''),
      sellerId: Joi.string().empty('').default(''),
      downloaded: Joi.boolean().default(false),
      phone: Joi.string().empty('').default(''),
      cellphone: Joi.string().empty('').default(''),
      email: Joi.string().empty('').default(''),
      ClientContactTemp: Joi.array().empty('').default(''),
    },
  }),
  clientTempController.create,
);

clientTempRouter.delete(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  clientTempController.delete,
);

clientTempRouter.get(
  '/cnpj',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      cnpj: Joi.string().required(),
    },
  }),
  clientTempController.findByCnpj,
);

clientTempRouter.get(
  '/listNewClientsTemp',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
    },
  }),
  clientTempController.listNewClientTemp,
);

clientTempRouter.patch(
  '/changeDownloaded',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
      downloaded: Joi.boolean().required(),
    },
  }),
  clientTempController.changeDownloaded,
);

export default clientTempRouter;
