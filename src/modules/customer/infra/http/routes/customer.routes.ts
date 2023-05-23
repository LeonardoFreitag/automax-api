import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import CustomerController from '@modules/customer/infra/http/controllers/CustomerControllers';

const customerRouter = Router();

const customerController = new CustomerController();

customerRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      cnpj: Joi.string().required(),
      companyName: Joi.string().required(),
    },
  }),
  customerController.create,
);

customerRouter.patch(
  '/',
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      cnpj: Joi.string().required(),
      companyName: Joi.string().required(),
    },
  }),
  customerController.update,
);

customerRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      cnpj: Joi.string().required(),
    },
  }),
  customerController.list,
);

customerRouter.delete(
  '/',
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  customerController.delete,
);

export default customerRouter;
