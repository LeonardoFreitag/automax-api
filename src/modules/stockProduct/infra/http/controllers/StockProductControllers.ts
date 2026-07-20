import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateStockProductService from '@modules/stockProduct/services/CreateStockProductService';
import UpdateStockProductService from '@modules/stockProduct/services/UpdateStockProductService';
import CheckExistsStockProductService from '@modules/stockProduct/services/CheckExistsStockProductService';
import ListStockProductService from '@modules/stockProduct/services/ListStockProductService';
import SearchStockProductService from '@modules/stockProduct/services/SearchStockProductService';
import FindStockProductByReferenceService from '@modules/stockProduct/services/FindStockProductByReferenceService';
import DeleteStockProductService from '@modules/stockProduct/services/DeleteStockProductService';

export default class StockProductController {
  // usado pelo ERP AutoMax para enviar/atualizar o cadastro de matéria-prima
  public async create(request: Request, response: Response): Promise<Response> {
    const { customerId, code, reference, description, unity } = request.body;

    const createStockProduct = container.resolve(CreateStockProductService);

    const stockProduct = await createStockProduct.execute({
      customerId,
      code,
      reference,
      description,
      unity,
    });

    return response.json(stockProduct);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const existsStockProduct = container.resolve(
      CheckExistsStockProductService,
    );

    const exists = await existsStockProduct.execute(data.id);

    if (!exists) {
      const createStockProductService = container.resolve(
        CreateStockProductService,
      );

      const stockProduct = await createStockProductService.execute({
        ...(data.id && { id: data.id }),
        customerId: data.customerId,
        code: data.code,
        reference: data.reference,
        description: data.description,
        unity: data.unity,
      });

      return response.json(stockProduct);
    }

    const updateStockProduct = container.resolve(UpdateStockProductService);

    const stockProduct = await updateStockProduct.execute(data);

    return response.json(stockProduct);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { customerId } = request.query;

    // console.log('customerId', customerId);

    const listStockProducts = container.resolve(ListStockProductService);

    const stockProduct = await listStockProducts.execute(String(customerId));

    return response.json(stockProduct);
  }

  // busca usada pela tela de seleção do app (código, referência ou descrição)
  public async search(request: Request, response: Response): Promise<Response> {
    const { customerId, search } = request.query;

    const searchStockProducts = container.resolve(SearchStockProductService);

    const stockProduct = await searchStockProducts.execute(
      String(customerId),
      String(search),
    );

    return response.json(stockProduct);
  }

  // usado pela leitura de QR code (o QR guarda o valor de "reference")
  public async findByReference(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { customerId, reference } = request.query;

    const findByReferenceService = container.resolve(
      FindStockProductByReferenceService,
    );

    const stockProduct = await findByReferenceService.execute(
      String(customerId),
      String(reference),
    );

    return response.json(stockProduct);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteStockProductService = container.resolve(
      DeleteStockProductService,
    );

    await deleteStockProductService.execute(String(id));

    return response.status(204).json();
  }
}
