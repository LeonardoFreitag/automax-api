import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ProductTissueController from '@modules/productTissue/infra/http/controllers/ProductTissueControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const productRouter = Router();

const productTissueController = new ProductTissueController();

productRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      code: Joi.string().required(),
      description: Joi.string().required(),
      type: Joi.string().required(),
      underConsultation: Joi.bool().required(),
      inRestocked: Joi.bool().required(),
      customerId: Joi.string().required(),
      productPriceId: Joi.string().required(),
    },
  }),
  productTissueController.createProductTissue,
);

productRouter.patch(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      code: Joi.string().required(),
      description: Joi.string().required(),
      type: Joi.string().required(),
      underConsultation: Joi.bool().required(),
      inRestocked: Joi.bool().required(),
      customerId: Joi.string().required(),
      productPriceId: Joi.string().required(),
    },
  }),
  productTissueController.updateProductTissue,
);

productRouter.delete(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  productTissueController.deleteProductTissue,
);

productRouter.delete(
  '/customerId',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
    },
  }),
  productTissueController.deleteProductTissueByCustomerId,
);

productRouter.delete(
  '/productPriceId',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      productPriceId: Joi.string().uuid().required(),
    },
  }),
  productTissueController.deleteProductTissueByProductPriceId,
);

productRouter.get(
  '/customerId',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
    },
  }),
  productTissueController.listByCustomerId,
);

productRouter.get(
  '/productPriceId',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
      productPriceId: Joi.string().uuid().required(),
    },
  }),
  productTissueController.listByProductPriceId,
);

export default productRouter;
