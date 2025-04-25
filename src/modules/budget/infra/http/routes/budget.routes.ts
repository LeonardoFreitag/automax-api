import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import BudgetControllers from '@modules/budget/infra/http/controllers/BudgetControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const budgetRouter = Router();

const budgetController = new BudgetControllers();

budgetRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      customerId: Joi.string().required(),
      sellerId: Joi.string().required(),
      budgetNumber: Joi.string().required(),
      budgetDate: Joi.date().required(),
      budgetExpiration: Joi.date().required(),
      clientId: Joi.string().required(),
      amount: Joi.number().required(),
      discount: Joi.number().required(),
      increment: Joi.number().required(),
      total: Joi.number().required(),
      notes: Joi.string().allow('').default(''),
      budgetStatus: Joi.string().required(),
      refusedNotes: Joi.string().required(),
      returnedNotes: Joi.string().required(),
      BudgetItems: Joi.array().required(),
      BudgetPaymentForm: Joi.array().required(),
    },
  }),
  budgetController.create,
);

budgetRouter.post(
  '/item',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      budgetId: Joi.string().required(),
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
  budgetController.createItem,
);

budgetRouter.post(
  '/paymentForm',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      budgetId: Joi.string().required(),
      paymentFormId: Joi.string().required(),
      description: Joi.string().required(),
      amount: Joi.number().required(),
      installments: Joi.number().required(),
    },
  }),
  budgetController.createPaymentForm,
);

budgetRouter.patch(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      customerId: Joi.string().required(),
      sellerId: Joi.string().required(),
      budgetNumber: Joi.string().required(),
      budgetDate: Joi.date().required(),
      budgetExpiration: Joi.date().required(),
      clientId: Joi.string().required(),
      amount: Joi.number().required(),
      discount: Joi.number().required(),
      increment: Joi.number().required(),
      total: Joi.number().required(),
      notes: Joi.string().allow('').default(''),
      budgetStatus: Joi.string().required(),
      refusedNotes: Joi.string().required(),
      returnedNotes: Joi.string().required(),
    },
  }),
  budgetController.update,
);

budgetRouter.patch(
  '/status',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      budgetNumber: Joi.string().required(),
      budgetStatus: Joi.string().required(),
      refusedNotes: Joi.string().allow('').default(''),
    },
  }),
  budgetController.updateStatus,
);

budgetRouter.patch(
  '/budgetNumber',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      budgetNumber: Joi.string().required(),
    },
  }),
  budgetController.updateBudgetNumber,
);

budgetRouter.patch(
  '/item',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      budgetId: Joi.string().required(),
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
  budgetController.updateItem,
);

budgetRouter.patch(
  '/paymentForm',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      budgetId: Joi.string().required(),
      paymentFormId: Joi.string().required(),
      description: Joi.string().required(),
      amount: Joi.number().required(),
      installments: Joi.number().required(),
    },
  }),
  budgetController.updatePaymentForm,
);

budgetRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
      budgetStatus: Joi.string().required(),
    },
  }),
  budgetController.list,
);

budgetRouter.get(
  '/budgetById',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  budgetController.listBudgetById,
);

budgetRouter.get(
  '/budgetBySellerId',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      sellerId: Joi.string().uuid().required(),
    },
  }),
  budgetController.listBudgetBySellerId,
);

budgetRouter.get(
  '/budgetBySellerIdAndMonth',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      sellerId: Joi.string().uuid().required(),
      month: Joi.number().required(),
      year: Joi.number().required(),
    },
  }),
  budgetController.listBudgetBySellerIdAndMonth,
);

budgetRouter.get(
  '/listBudgetsPagineted',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      sellerId: Joi.string().uuid().required(),
      page: Joi.number().required(),
      rows: Joi.number().required(),
    },
  }),
  budgetController.listBudgetsPaginated,
);

budgetRouter.get(
  '/listBudgetsPaginetedByCompanyName',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      sellerId: Joi.string().uuid().required(),
      companyName: Joi.string().required(),
      page: Joi.number().required(),
      rows: Joi.number().required(),
    },
  }),
  budgetController.listBudgetsPaginatedByCompanyName,
);

budgetRouter.delete(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  budgetController.delete,
);

budgetRouter.delete(
  '/item',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  budgetController.deleteItem,
);

budgetRouter.delete(
  '/paymentForm',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  budgetController.deletePaymentForm,
);

export default budgetRouter;
