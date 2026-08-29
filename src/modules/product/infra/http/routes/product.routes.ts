import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ProductController from '@modules/product/infra/http/controllers/ProductControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import multer from 'multer';
import multerConfig from '@config/upload';

const productRouter = Router();

const productController = new ProductController();

const upload = multer(multerConfig.multer);

/**
 * POST e PATCH historicamente divergiam no nome do array de preços
 * (`ProductPrice` no POST, `productPrice` no PATCH), o que fazia o ERP falhar
 * ao reaproveitar o mesmo payload. Ambas as rotas agora aceitam as duas
 * grafias — `.or()` exige que ao menos uma esteja presente.
 *
 * `groupId` passou a aceitar string vazia no schema **de propósito**: assim o
 * erro deixa de ser um "groupId is not allowed to be empty" do Joi e vira uma
 * mensagem de domínio, dizendo qual grupo não foi encontrado e como resolver.
 */
productRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: Joi.object()
      .keys({
        id: Joi.string().uuid(),
        customerId: Joi.string().required(),
        code: Joi.string().required(),
        reference: Joi.string().required(),
        description: Joi.string().required(),
        unity: Joi.string().required(),
        groupId: Joi.string().allow('').required(),
        ProductPrice: Joi.array(),
        productPrice: Joi.array(),
      })
      .or('ProductPrice', 'productPrice'),
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
    [Segments.BODY]: Joi.object()
      .keys({
        id: Joi.string().required(),
        customerId: Joi.string().required(),
        code: Joi.string().required(),
        reference: Joi.string().required(),
        description: Joi.string().required(),
        unity: Joi.string().required(),
        groupId: Joi.string().allow('').required(),
        productPrice: Joi.array(),
        ProductPrice: Joi.array(),
      })
      .or('productPrice', 'ProductPrice'),
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

/**
 * Ativa/desativa o produto. Mesmo contrato de PATCH /user/status.
 *
 * Inativar tira o produto das telas de escolha e faz POST /sale e POST /budget
 * recusarem o lançamento, sem apagar cadastro nem histórico.
 *
 * `isActive` fica de fora do corpo de POST /product e PATCH /product de
 * propósito, pelo mesmo motivo do `isActivated` do usuário: assim a carga de
 * produtos não ressuscita item inativado. Esta rota é o único caminho.
 */
productRouter.patch(
  '/status',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      id: Joi.string().uuid().required(),
      customerId: Joi.string().uuid().required(),
      isActive: Joi.boolean().required(),
    },
  }),
  productController.changeStatus,
);

/**
 * As rotas de listagem devolvem apenas produtos ativos.
 *
 * `includeInactive=true` existe para consumidores de conferência/retaguarda que
 * precisam ver o catálogo inteiro. O app nunca envia: toda tela dele é entrada
 * de movimento novo. Consulta ao passado (itens de pedido e orçamento) não
 * passa por aqui — lê SaleItems/BudgetItems, que são desnormalizados.
 */
productRouter.get(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
      includeInactive: Joi.boolean(),
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
      includeInactive: Joi.boolean(),
    },
  }),
  productController.listByGroupId,
);

productRouter.get(
  '/priceTables',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
      regionId: Joi.string().required(),
      includeInactive: Joi.boolean(),
    },
  }),
  productController.listPriceTables,
);

productRouter.get(
  '/priceTable',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
      tableCode: Joi.string().required(),
      regionId: Joi.string().required(),
      groupId: Joi.string().uuid(),
      search: Joi.string().allow(''),
      page: Joi.number().integer().min(1),
      perPage: Joi.number().integer().min(1).max(500),
      includeInactive: Joi.boolean(),
    },
  }),
  productController.listByPriceTable,
);

/**
 * Consulta pontual do preço de um produto numa tabela. Não filtra inativo de
 * propósito: é releitura de um item já escolhido, não oferta de item novo.
 */
productRouter.get(
  '/tableCode',
  ensureAuthenticated,
  celebrate({
    [Segments.QUERY]: {
      customerId: Joi.string().uuid().required(),
      productCode: Joi.string().required(),
      tableCode: Joi.string().required(),
      regionId: Joi.string().required(),
    },
  }),
  productController.listByTableCode,
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
