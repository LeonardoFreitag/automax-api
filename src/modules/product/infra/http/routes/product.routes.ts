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
      group: Joi.string().required(),
      price: Joi.array().required(),
      tissue: Joi.array().required(),
    },
  }),
  productController.create,
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
      group: Joi.string().required(),
      price: Joi.array().required(),
      tissue: Joi.array().required(),
    },
  }),
  productController.update,
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
