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
      financialPendency: Joi.bool().default(false),
      isNew: Joi.bool().empty('').default(''),
      sellerId: Joi.string().empty('').default(''),
      phone: Joi.string().empty('').default(''),
      cellphone: Joi.string().empty('').default(''),
      email: Joi.string().empty('').default(''),
      ClientContact: Joi.array().empty('').default(''),
      ClientPaymentForm: Joi.array().empty('').default(''),
    },
  }),
  clientController.create,
);

clientRouter.post(
  '/contact',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      clientId: Joi.string().required(),
      name: Joi.string().required(),
      fone: Joi.string().empty('').default(''),
      foneType: Joi.string().empty('').default(''),
      isWhatsApp: Joi.bool().empty('').default(''),
      email: Joi.string().empty('').default(''),
      job: Joi.string().empty('').default(''),
    },
  }),
  clientController.createContact,
);

clientRouter.post(
  '/paymentForm',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      clientId: Joi.string().required(),
      paymentFormId: Joi.string().required(),
      description: Joi.string().required(),
      installmentsLimit: Joi.number().required(),
    },
  }),
  clientController.createPaymentForm,
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
      financialPendency: Joi.bool().default(false),
      isNew: Joi.bool().empty('').default(''),
      sellerId: Joi.string().empty('').default(''),
      phone: Joi.string().empty('').default(''),
      cellphone: Joi.string().empty('').default(''),
      email: Joi.string().empty('').default(''),
      contacts: Joi.array().required(),
      paymentForms: Joi.array().required(),
    },
  }),
  clientController.update,
);

clientRouter.patch(
  '/status',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      isActivated: Joi.bool().required(),
    },
  }),
  clientController.changeClientStatus,
);

clientRouter.patch(
  '/contact',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      clientId: Joi.string().required(),
      name: Joi.string().required(),
      fone: Joi.string().required(),
      foneType: Joi.string().required(),
      isWhatsApp: Joi.bool().required(),
      email: Joi.string().required(),
      job: Joi.string().required(),
    },
  }),
  clientController.updateContact,
);

clientRouter.patch(
  '/paymentForm',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      clientId: Joi.string().required(),
      paymentFormId: Joi.string().required(),
      description: Joi.string().required(),
      installmentsLimit: Joi.number().required(),
    },
  }),
  clientController.updatePaymentForm,
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

clientRouter.get(
  '/paymentForm',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
      code: Joi.string().required(),
      paymentFormId: Joi.string().required(),
    },
  }),
  clientController.listByClientCodePaymentId,
);

clientRouter.get(
  '/seller',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
      sellerId: Joi.string().uuid().required(),
    },
  }),
  clientController.listBySellerId,
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

clientRouter.delete(
  '/contact',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  clientController.deleteContact,
);

clientRouter.delete(
  '/paymentForm',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  clientController.deletePaymentForm,
);

export default clientRouter;
