import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateProductService from '@modules/product/services/CreateProductService';
import CreateProductPriceService from '@modules/product/services/CreateProductPriceService';
import UpdateProductService from '@modules/product/services/UdpateProductService';
import UpdateProductPriceService from '@modules/product/services/UdpateProductPriceService';
import ListProductService from '@modules/product/services/ListProductService';
import ListProductByGroupIdService from '@modules/product/services/ListProductByGroupIdService';
import DeleteProductService from '@modules/product/services/DeleteProductService';
import DeleteProductPriceService from '@modules/product/services/DeleteProductPriceService';
import UploadPhotoService from '@modules/product/services/UploadPhotoService';

export default class ProductController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      customerId,
      code,
      reference,
      description,
      unity,
      groupId,
      ProductPrice,
    } = request.body;

    const createProduct = container.resolve(CreateProductService);

    const Product = await createProduct.execute({
      customerId,
      code,
      reference,
      description,
      unity,
      groupId,
      ProductPrice,
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
    const { productPrice } = request.body;

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

  public async list(request: Request, response: Response): Promise<Response> {
    const { customerId } = request.query;

    const listProducts = container.resolve(ListProductService);

    const Product = await listProducts.execute(String(customerId));

    return response.json(Product);
  }

  public async listByGroupId(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { customerId, groupId } = request.query;

    const listProductsByGroupId = container.resolve(
      ListProductByGroupIdService,
    );

    const Product = await listProductsByGroupId.execute(
      String(customerId),
      String(groupId),
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
