import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateProductService from '@modules/product/services/CreateProductService';
import UpdateProductService from '@modules/product/services/UdpateProductService';
import ListProductService from '@modules/product/services/ListProductService';
import DeleteProductService from '@modules/product/services/DeleteProductService';
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
      group,
      price,
      tissue,
    } = request.body;

    const createProduct = container.resolve(CreateProductService);

    const Product = await createProduct.execute({
      customerId,
      code,
      reference,
      description,
      unity,
      groupId,
      group,
      price,
      tissue,
    });

    return response.json(classToClass(Product));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const updateProduct = container.resolve(UpdateProductService);

    const Product = await updateProduct.execute(data);

    return response.json(classToClass(Product));
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { customerId } = request.query;

    const listProducts = container.resolve(ListProductService);

    const Product = await listProducts.execute(String(customerId));

    return response.json(classToClass(Product));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteProductService = container.resolve(DeleteProductService);

    await deleteProductService.execute(String(id));

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

    return response.json(classToClass(entrieAttach));
  }
}
