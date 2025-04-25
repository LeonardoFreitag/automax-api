import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateProductTissueService from '@modules/productTissue/services/CreateProductTissueService';

import UpdateProductTissueService from '@modules/productTissue/services/UdpateProductTissueService';

import DeleteProductTissueService from '@modules/productTissue/services/DeleteProductTissueService';
import DeleteProductTissueByProductPriceIdService from '@modules/productTissue/services/DeleteProductTissueBydProductPriceIdService';
import DeleteProductTissueByCustomerIdService from '@modules/productTissue/services/DeleteProductTissueByCustomerIdService';

import ListProductTissueByCustomerIdService from '@modules/productTissue/services/ListProductTissueByCustomerIdService';
import ListProductTissueByProductPriceIdService from '@modules/productTissue/services/ListProductTissueByProductPriceIdService';

export default class ProductTissueController {
  public async createProductTissue(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const {
      code,
      description,
      type,
      underConsultation,
      inRestocked,
      customerId,
      productPriceId,
    } = request.body;

    const createProductTissue = container.resolve(CreateProductTissueService);

    const productTissue = await createProductTissue.execute({
      code,
      description,
      type,
      underConsultation,
      inRestocked,
      customerId,
      productPriceId,
    });

    return response.json(productTissue);
  }

  public async updateProductTissue(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const data = request.body;

    const updateProductTissue = container.resolve(UpdateProductTissueService);

    const productTissue = await updateProductTissue.execute(data);

    return response.json(productTissue);
  }

  public async deleteProductTissue(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.query;

    const deleteProductTissueService = container.resolve(
      DeleteProductTissueService,
    );

    await deleteProductTissueService.execute(String(id));

    return response.status(204).json();
  }

  public async deleteProductTissueByProductPriceId(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { productPriceId } = request.query;

    const deleteProductTissueByProductPriceIdService = container.resolve(
      DeleteProductTissueByProductPriceIdService,
    );

    await deleteProductTissueByProductPriceIdService.execute(
      String(productPriceId),
    );

    return response.status(204).json();
  }

  public async deleteProductTissueByCustomerId(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { customerId } = request.query;

    const deleteProductTissueByCustomerIdService = container.resolve(
      DeleteProductTissueByCustomerIdService,
    );

    await deleteProductTissueByCustomerIdService.execute(String(customerId));

    return response.status(204).json();
  }

  public async listByCustomerId(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { customerId } = request.query;

    const listProductsTissueByCustomerId = container.resolve(
      ListProductTissueByCustomerIdService,
    );

    const Product = await listProductsTissueByCustomerId.execute(
      String(customerId),
    );

    return response.json(Product);
  }

  public async listByProductPriceId(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { customerId, productPriceId } = request.query;

    const listProductsTissueByProductPriceId = container.resolve(
      ListProductTissueByProductPriceIdService,
    );

    const Product = await listProductsTissueByProductPriceId.execute(
      String(customerId),
      String(productPriceId),
    );

    return response.json(Product);
  }
}
