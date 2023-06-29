import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ProductController from '@modules/product/infra/http/controllers/ProductControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import multer from 'multer';
import multerConfig from '@config/upload';

const productRouter = Router();

const productController = new ProductController();

const upload = multer(multerConfig.multer);

productRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      customerId: Joi.string().required(),
      code: Joi.string().required(),
      reference: Joi.string().required(),
      description: Joi.string().required(),
      unity: Joi.string().required(),
      groupId: Joi.string().required(),
      ProductPrice: Joi.array().required(),
    },
  }),
  productController.create,
);

productRouter.post(
  '/price',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      productId: Joi.string().required(),
      code: Joi.string().required(),
      tableName: Joi.string().required(),
      price: Joi.number().required(),
      height: Joi.number().required(),
      heightUnity: Joi.string().required(),
      minWidth: Joi.number().required(),
      width: Joi.number().required(),
      maxWidth: Joi.number().required(),
      widthUnity: Joi.string().required(),
      depth: Joi.number().required(),
      depthUnity: Joi.string().required(),
      depthOpen: Joi.number().required(),
      depthOpenUnity: Joi.string().required(),
      additionalPercentage: Joi.number().required(),
      regionId: Joi.string().required(),
    },
  }),
  productController.createProductPrice,
);

productRouter.patch(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      customerId: Joi.string().required(),
      code: Joi.string().required(),
      reference: Joi.string().required(),
      description: Joi.string().required(),
      unity: Joi.string().required(),
      groupId: Joi.string().required(),
      productPrice: Joi.array().required(),
    },
  }),
  productController.update,
);

productRouter.patch(
  '/price',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
      productId: Joi.string().required(),
      code: Joi.string().required(),
      tableName: Joi.string().required(),
      price: Joi.number().required(),
      height: Joi.number().required(),
      heightUnity: Joi.string().required(),
      minWidth: Joi.number().required(),
      width: Joi.number().required(),
      maxWidth: Joi.number().required(),
      widthUnity: Joi.string().required(),
      depth: Joi.number().required(),
      depthUnity: Joi.string().required(),
      depthOpen: Joi.number().required(),
      depthOpenUnity: Joi.string().required(),
      additionalPercentage: Joi.number().required(),
      regionId: Joi.string().required(),
    },
  }),
  productController.updateProductPrice,
);

productRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
    },
  }),
  productController.list,
);

productRouter.get(
  '/group',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
      groupId: Joi.string().uuid().required(),
    },
  }),
  productController.listByGroupId,
);

productRouter.delete(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  productController.delete,
);

productRouter.delete(
  '/price',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      id: Joi.string().uuid().required(),
    },
  }),
  productController.deleteProductPrice,
);

productRouter.post(
  '/uploadPhoto',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      productId: Joi.string().uuid().required(),
      size: Joi.string().required(),
    },
  }),
  upload.single('productPhoto'),
  productController.uploadPhoto,
);

export default productRouter;
