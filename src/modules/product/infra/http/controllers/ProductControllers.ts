import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { Prisma } from '@prisma/client';
import CreateProductService from '@modules/product/services/CreateProductService';
import CreateProductPriceService from '@modules/product/services/CreateProductPriceService';
import UpdateProductService from '@modules/product/services/UdpateProductService';
import UpdateProductPriceService from '@modules/product/services/UdpateProductPriceService';
import ListProductService from '@modules/product/services/ListProductService';
import ListProductByTablCodeService from '@modules/product/services/ListProductByTableCodeService';
import ListProductByGroupIdService from '@modules/product/services/ListProductByGroupIdService';
import ListPriceTablesService from '@modules/product/services/ListPriceTablesService';
import ListProductByPriceTableService from '@modules/product/services/ListProductByPriceTableService';
import DeleteProductService from '@modules/product/services/DeleteProductService';
import DeleteProductPriceService from '@modules/product/services/DeleteProductPriceService';
import UploadPhotoService from '@modules/product/services/UploadPhotoService';
import CheckExistsProductService from '@modules/product/services/CheckExistsProductService';
import ChangeStatusProductService from '@modules/product/services/ChangeStatusProductService';

/**
 * O ERP envia o array de preços ora como `ProductPrice`, ora como
 * `productPrice`. As duas rotas aceitam ambas as grafias; esta função escolhe a
 * que veio preenchida.
 */
function resolveProductPrice(body: Record<string, unknown>) {
  const { productPrice, ProductPrice } = body;

  if (Array.isArray(productPrice)) {
    return productPrice;
  }

  if (Array.isArray(ProductPrice)) {
    return ProductPrice;
  }

  return [];
}

/**
 * `?includeInactive=true` chega como string na query. Sem esta conversão,
 * `includeInactive=false` seria uma string não-vazia e portanto verdadeira —
 * exatamente o contrário do pedido.
 */
function resolveIncludeInactive(value: unknown): boolean {
  return value === 'true' || value === true;
}

export default class ProductController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id, customerId, code, reference, description, unity, groupId } =
      request.body;

    const ProductPrice = resolveProductPrice(request.body);

    const createProduct = container.resolve(CreateProductService);

    const Product = await createProduct.execute({
      ...(id && { id }),
      customerId,
      code,
      reference,
      description,
      unity,
      groupId,
      ProductPrice:
        ProductPrice as Prisma.ProductPriceUncheckedCreateNestedManyWithoutProductInput,
    });

    return response.json(Product);
  }

  public async createProductPrice(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const {
      productId,
      code,
      tableName,
      price,
      height,
      heightUnity,
      minWidth,
      width,
      maxWidth,
      widthUnity,
      depth,
      depthUnity,
      depthOpen,
      depthOpenUnity,
      additionalPercentage,
      regionId,
    } = request.body;

    const createProductPrice = container.resolve(CreateProductPriceService);

    const productPrice = await createProductPrice.execute({
      productId,
      code,
      tableName,
      price,
      height,
      heightUnity,
      minWidth,
      width,
      maxWidth,
      widthUnity,
      depth,
      depthUnity,
      depthOpen,
      depthOpenUnity,
      additionalPercentage,
      regionId,
    });

    return response.json(productPrice);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body;
    const productPrice = resolveProductPrice(request.body);

    const existsProduct = container.resolve(CheckExistsProductService);

    const exists = await existsProduct.execute(data.id);

    if (!exists) {
      const createProductService = container.resolve(CreateProductService);

      const newProduct = {
        ...(data.id && { id: data.id }),
        customerId: data.customerId,
        code: data.code,
        reference: data.reference,
        description: data.description,
        unity: data.unity,
        groupId: data.groupId,
        ProductPrice:
          productPrice as Prisma.ProductPriceUncheckedCreateNestedManyWithoutProductInput,
      };

      const product = await createProductService.execute(newProduct);

      return response.json(product);
    }

    const updateProduct = container.resolve(UpdateProductService);

    const product = await updateProduct.execute(data, productPrice);

    return response.json(product);
  }

  public async updateProductPrice(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const data = request.body;

    const updateProductPrice = container.resolve(UpdateProductPriceService);

    const productPrice = await updateProductPrice.execute(data);

    return response.json(productPrice);
  }

  public async changeStatus(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id, customerId, isActive } = request.body;

    const changeStatusProduct = container.resolve(ChangeStatusProductService);

    const product = await changeStatusProduct.execute(
      String(id),
      String(customerId),
      isActive,
    );

    return response.json(product);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { customerId, includeInactive } = request.query;

    const listProducts = container.resolve(ListProductService);

    const Product = await listProducts.execute(
      String(customerId),
      resolveIncludeInactive(includeInactive),
    );

    return response.json(Product);
  }

  public async listByGroupId(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { customerId, groupId, includeInactive } = request.query;

    const listProductsByGroupId = container.resolve(
      ListProductByGroupIdService,
    );

    const Product = await listProductsByGroupId.execute(
      String(customerId),
      String(groupId),
      resolveIncludeInactive(includeInactive),
    );

    return response.json(Product);
  }

  public async listPriceTables(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { customerId, regionId, includeInactive } = request.query;

    const listPriceTables = container.resolve(ListPriceTablesService);

    const priceTables = await listPriceTables.execute(
      String(customerId),
      String(regionId),
      resolveIncludeInactive(includeInactive),
    );

    return response.json(priceTables);
  }

  public async listByPriceTable(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const {
      customerId,
      tableCode,
      regionId,
      groupId,
      search,
      page,
      perPage,
      includeInactive,
    } = request.query;

    const listProductByPriceTable = container.resolve(
      ListProductByPriceTableService,
    );

    const { products, total } = await listProductByPriceTable.execute({
      customerId: String(customerId),
      tableCode: String(tableCode),
      regionId: String(regionId),
      includeInactive: resolveIncludeInactive(includeInactive),
      ...(groupId ? { groupId: String(groupId) } : {}),
      ...(search ? { search: String(search) } : {}),
      ...(page ? { page: Number(page) } : {}),
      ...(perPage ? { perPage: Number(perPage) } : {}),
    });

    return response.json({
      products,
      total,
      page: page ? Number(page) : null,
      perPage: perPage ? Number(perPage) : null,
    });
  }

  public async listByTableCode(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { customerId, productCode, tableCode, regionId } = request.query;

    const listProductsByGroupId = container.resolve(
      ListProductByTablCodeService,
    );

    const Product = await listProductsByGroupId.execute(
      String(customerId),
      String(productCode),
      String(tableCode),
      String(regionId),
    );

    return response.json(Product);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteProductService = container.resolve(DeleteProductService);

    await deleteProductService.execute(String(id));

    return response.status(204).json();
  }

  public async deleteProductPrice(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.query;

    const deleteProductPriceService = container.resolve(
      DeleteProductPriceService,
    );

    await deleteProductPriceService.execute(String(id));

    return response.status(204).json();
  }

  public async uploadPhoto(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { productId, size } = request.query;
    const uploadPhotoService = container.resolve(UploadPhotoService);
    const id = String(productId);
    const sz = String(size);
    const entrieAttach = await uploadPhotoService.execute({
      productId: id,
      photoSize: sz,
      photoFileName: request.file.filename,
    });

    return response.json(entrieAttach);
  }
}
