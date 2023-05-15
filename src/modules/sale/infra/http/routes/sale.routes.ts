import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import SaleControllers from '@modules/sale/infra/http/controllers/SaleControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import multer from 'multer';
import multerConfig from '@config/upload';

const saleRouter = Router();

const saleController = new SaleControllers();

const upload = multer(multerConfig.multer);

saleRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      customerId: Joi.string().required(),
      selerId: Joi.string().required(),
      saleNumber: Joi.string().required(),
      saleDate: Joi.date().required(),
      clientId: Joi.string().required(),
      items: Joi.array().required(),
      amount: Joi.number().required(),
      discount: Joi.number().required(),
      total: Joi.number().required(),
      notes: Joi.string().required(),
      finished: Joi.boolean().required(),
      sent: Joi.boolean().required(),
      refused: Joi.boolean().required(),
      refusedNotes: Joi.string().required(),
      returned: Joi.boolean().required(),
      returnedNotes: Joi.string().required(),
      paymentForm: Joi.array().required(),
      signatureBase64: Joi.string().required(),
      accepted: Joi.bool().required(),
    },
  }),
  saleController.create,
);

saleRouter.patch(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      customerId: Joi.string().required(),
      selerId: Joi.string().required(),
      saleNumber: Joi.string().required(),
      saleDate: Joi.date().required(),
      clientId: Joi.string().required(),
      items: Joi.array().required(),
      amount: Joi.number().required(),
      discount: Joi.number().required(),
      total: Joi.number().required(),
      notes: Joi.string().required(),
      finished: Joi.boolean().required(),
      sent: Joi.boolean().required(),
      refused: Joi.boolean().required(),
      refusedNotes: Joi.string().required(),
      returned: Joi.boolean().required(),
      returnedNotes: Joi.string().required(),
      paymentForm: Joi.array().required(),
      signatureBase64: Joi.string().required(),
      accepted: Joi.bool().required(),
    },
  }),
  saleController.update,
);

saleRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
    },
  }),
  saleController.list,
);

saleRouter.delete(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  saleController.delete,
);

saleRouter.post(
  '/uploadSignature',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      saleId: Joi.string().uuid().required(),
      size: Joi.string().required(),
    },
  }),
  upload.single('saleSignature'),
  saleController.uploadSignature,
);

export default saleRouter;
