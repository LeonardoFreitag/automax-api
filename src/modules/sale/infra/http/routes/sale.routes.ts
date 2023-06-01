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
      sellerId: Joi.string().required(),
      saleNumber: Joi.string().required(),
      saleDate: Joi.date().required(),
      clientId: Joi.string().required(),
      amount: Joi.number().required(),
      discount: Joi.number().required(),
      increment: Joi.number().required(),
      total: Joi.number().required(),
      notes: Joi.string().required(),
      saleStatus: Joi.string().required(),
      refusedNotes: Joi.string().required(),
      returnedNotes: Joi.string().required(),
      signatureBase64: Joi.string().required(),
      SaleItems: Joi.array().required(),
      SalePaymentForm: Joi.array().required(),
    },
  }),
  saleController.create,
);

saleRouter.post(
  '/item',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      saleId: Joi.string().required(),
      productId: Joi.string().required(),
      code: Joi.string().required(),
      reference: Joi.string().required(),
      description: Joi.string().required(),
      unity: Joi.string().required(),
      tableId: Joi.string().required(),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
      amount: Joi.number().required(),
      notes: Joi.string().required(),
      originalPrice: Joi.number().required(),
      groupId: Joi.string().required(),
      tissueId: Joi.string().required(),
      underMeasure: Joi.boolean().required(),
      widthSale: Joi.number().required(),
    },
  }),
  saleController.createItem,
);

saleRouter.post(
  '/paymentForm',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      saleId: Joi.string().required(),
      tissueCode: Joi.string().required(),
      paymentFormId: Joi.string().required(),
      descripriont: Joi.string().required(),
      amount: Joi.number().required(),
      installments: Joi.number().required(),
    },
  }),
  saleController.createPaymentForm,
);

saleRouter.patch(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      customerId: Joi.string().required(),
      sellerId: Joi.string().required(),
      saleNumber: Joi.string().required(),
      saleDate: Joi.date().required(),
      clientId: Joi.string().required(),
      amount: Joi.number().required(),
      discount: Joi.number().required(),
      increment: Joi.number().required(),
      total: Joi.number().required(),
      notes: Joi.string().required(),
      saleStatus: Joi.string().required(),
      refusedNotes: Joi.string().required(),
      returnedNotes: Joi.string().required(),
      signatureBase64: Joi.string().required(),
    },
  }),
  saleController.update,
);

saleRouter.patch(
  '/status',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      saleNumber: Joi.string().required(),
      saleStatus: Joi.string().required(),
    },
  }),
  saleController.updateStatus,
);

saleRouter.patch(
  '/item',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      saleId: Joi.string().required(),
      productId: Joi.string().required(),
      code: Joi.string().required(),
      reference: Joi.string().required(),
      description: Joi.string().required(),
      unity: Joi.string().required(),
      tableId: Joi.string().required(),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
      amount: Joi.number().required(),
      notes: Joi.string().required(),
      originalPrice: Joi.number().required(),
      groupId: Joi.string().required(),
      tissueId: Joi.string().required(),
      underMeasure: Joi.boolean().required(),
      widthSale: Joi.number().required(),
    },
  }),
  saleController.updateItem,
);

saleRouter.patch(
  '/paymentForm',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      saleId: Joi.string().required(),
      tissueCode: Joi.string().required(),
      paymentFormId: Joi.string().required(),
      descripriont: Joi.string().required(),
      amount: Joi.number().required(),
      installments: Joi.number().required(),
    },
  }),
  saleController.updatePaymentForm,
);

saleRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
      saleStatus: Joi.string().required(),
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

saleRouter.delete(
  '/item',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  saleController.deleteItem,
);

saleRouter.delete(
  '/paymentForm',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  saleController.deletePaymentForm,
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
