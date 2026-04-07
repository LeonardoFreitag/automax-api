import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import SaleControllers from '@modules/sale/infra/http/controllers/SaleControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import multer from 'multer';
import multerConfig from '@config/upload';

const saleRouter = Router();

const saleController = new SaleControllers();

const upload = multer(multerConfig.multer);

// cadastra um pedido
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
      clientCode: Joi.string().allow('').default(''),
      amount: Joi.number().required(),
      discount: Joi.number().required(),
      increment: Joi.number().required(),
      total: Joi.number().required(),
      notes: Joi.string().allow('').default(''),
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

// cadastra um item do pedido
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
      tableId: Joi.string().allow('').default(''),
      tableCode: Joi.string().allow('').default(''),
      tableName: Joi.string().allow('').default(''),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
      amount: Joi.number().required(),
      notes: Joi.string().allow('').default(''),
      originalPrice: Joi.number().required(),
      groupId: Joi.string().required(),
      groupName: Joi.string().required(),
      tissueId: Joi.string().required(),
      tissueCode: Joi.string().required(),
      tissueName: Joi.string().required(),
      underMeasure: Joi.boolean().required(),
      widthSale: Joi.number().required(),
    },
  }),
  saleController.createItem,
);

// cadastra a forma de pagamento do pedido
saleRouter.post(
  '/paymentForm',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      saleId: Joi.string().required(),
      paymentFormId: Joi.string().required(),
      description: Joi.string().required(),
      amount: Joi.number().required(),
      installments: Joi.number().required(),
    },
  }),
  saleController.createPaymentForm,
);

// altera os dados do pedido
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
      clientCode: Joi.string().allow('').default(''),
      amount: Joi.number().required(),
      discount: Joi.number().required(),
      increment: Joi.number().required(),
      total: Joi.number().required(),
      notes: Joi.string().allow('').default(''),
      saleStatus: Joi.string().required(),
      refusedNotes: Joi.string().required(),
      returnedNotes: Joi.string().required(),
      signatureBase64: Joi.string().required(),
    },
  }),
  saleController.update,
);

// altera o status do pedido
saleRouter.patch(
  '/status',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      saleNumber: Joi.string().required(),
      saleStatus: Joi.string().required(),
      refusedNotes: Joi.string().allow('').default(''),
    },
  }),
  saleController.updateStatus,
);

// altera os dados do item do pedido
saleRouter.patch(
  '/saleNumber',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      saleNumber: Joi.string().required(),
    },
  }),
  saleController.updateSaleNumber,
);

// altera os dados do item do pedido
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
      tableId: Joi.string().allow('').default(''),
      tableCode: Joi.string().allow('').default(''),
      tableName: Joi.string().allow('').default(''),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
      amount: Joi.number().required(),
      notes: Joi.string().allow('').default(''),
      originalPrice: Joi.number().required(),
      groupId: Joi.string().required(),
      groupName: Joi.string().required(),
      tissueId: Joi.string().required(),
      tissueCode: Joi.string().required(),
      tissueName: Joi.string().required(),
      underMeasure: Joi.boolean().required(),
      widthSale: Joi.number().required(),
    },
  }),
  saleController.updateItem,
);

// altera os dados da forma de pagamento do pedido
saleRouter.patch(
  '/paymentForm',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      saleId: Joi.string().required(),
      paymentFormId: Joi.string().required(),
      description: Joi.string().required(),
      amount: Joi.number().required(),
      installments: Joi.number().required(),
    },
  }),
  saleController.updatePaymentForm,
);

// lista os pedidos
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

// lista os pedidos por id
saleRouter.get(
  '/saleById',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  saleController.listSaleById,
);

// lista os pedidos por vendedor
saleRouter.get(
  '/saleBySellerId',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      sellerId: Joi.string().uuid().required(),
    },
  }),
  saleController.listSaleBySellerId,
);

// lista os pedidos por vendedor, mês e ano
saleRouter.get(
  '/saleBySellerIdAndMonth',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      sellerId: Joi.string().uuid().required(),
      month: Joi.number().required(),
      year: Joi.number().required(),
    },
  }),
  saleController.listSaleBySellerIdAndMonth,
);

// lista os pedidos paginados
saleRouter.get(
  '/listSalesPagineted',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      sellerId: Joi.string().uuid().required(),
      page: Joi.number().required(),
      rows: Joi.number().required(),
    },
  }),
  saleController.listSalesPaginated,
);

// lista os pedidos paginados por nome da empresa
saleRouter.get(
  '/listSalesPaginetedByCompanyName',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      sellerId: Joi.string().uuid().required(),
      companyName: Joi.string().required(),
      page: Joi.number().required(),
      rows: Joi.number().required(),
    },
  }),
  saleController.listSalesPaginatedByCompanyName,
);

// exclui um pedido
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

// exclui um item do pedido
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

// exclui uma forma de pagamento do pedido
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

// upload da assinatura do pedido
saleRouter.post(
  '/uploadSignature',
  ensureAuthenticated,
  // celebrate({
  //   [Segments.BODY]: {
  //     saleId: Joi.string().uuid().required(),
  //     size: Joi.string().required(),
  //   },
  // }),
  upload.single('saleSignature'),
  saleController.uploadSignature,
);

export default saleRouter;
