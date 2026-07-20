import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateStockWithdrawalService from '@modules/stockWithdrawal/services/CreateStockWithdrawalService';
import CreateStockWithdrawalItemService from '@modules/stockWithdrawal/services/CreateStockWithdrawalItemService';
import ListStockWithdrawalService from '@modules/stockWithdrawal/services/ListStockWithdrawalService';
import ListStockWithdrawalItemsService from '@modules/stockWithdrawal/services/ListStockWithdrawalItemsService';
import UpdateStockWithdrawalStatusService from '@modules/stockWithdrawal/services/UpdateStockWithdrawalStatusService';
import ChangeStockWithdrawalDownloadedService from '@modules/stockWithdrawal/services/ChangeStockWithdrawalDownloadedService';
import DeleteStockWithdrawalItemService from '@modules/stockWithdrawal/services/DeleteStockWithdrawalItemService';

export default class StockWithdrawalController {
  // usuário autorizado inicia uma nova baixa de estoque no almoxarifado
  public async create(request: Request, response: Response): Promise<Response> {
    const { customerId, userId, userName, notes } = request.body;

    const createStockWithdrawal = container.resolve(
      CreateStockWithdrawalService,
    );

    const stockWithdrawal = await createStockWithdrawal.execute({
      customerId,
      userId,
      userName,
      notes,
    });

    return response.json(stockWithdrawal);
  }

  // registra a retirada de um produto (chamado a cada leitura/busca no app)
  public async createItem(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const {
      stockWithdrawalId,
      stockProductId,
      code,
      reference,
      description,
      unity,
      quantity,
    } = request.body;

    const createStockWithdrawalItem = container.resolve(
      CreateStockWithdrawalItemService,
    );

    const item = await createStockWithdrawalItem.execute({
      stockWithdrawalId,
      stockProductId,
      code,
      reference,
      description,
      unity,
      quantity,
    });

    return response.json(item);
  }

  // downloaded=false é a consulta usada pelo ERP para saber o que falta processar
  public async list(request: Request, response: Response): Promise<Response> {
    const { customerId, downloaded } = request.query;

    const listStockWithdrawals = container.resolve(
      ListStockWithdrawalService,
    );

    const stockWithdrawals = await listStockWithdrawals.execute(
      String(customerId),
      downloaded === undefined ? undefined : downloaded === 'true',
    );

    return response.json(stockWithdrawals);
  }

  public async listItems(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { stockWithdrawalId } = request.query;

    const listStockWithdrawalItems = container.resolve(
      ListStockWithdrawalItemsService,
    );

    const items = await listStockWithdrawalItems.execute(
      String(stockWithdrawalId),
    );

    return response.json(items);
  }

  // usuário finaliza a baixa no app
  public async updateStatus(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id, status } = request.body;

    const updateStockWithdrawalStatus = container.resolve(
      UpdateStockWithdrawalStatusService,
    );

    const stockWithdrawal = await updateStockWithdrawalStatus.execute(
      id,
      status,
    );

    return response.json(stockWithdrawal);
  }

  // ERP marca como processado depois de gravar no Firebird e dar baixa no estoque
  public async changeDownloaded(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id, downloaded } = request.query;

    const changeDownloaded = container.resolve(
      ChangeStockWithdrawalDownloadedService,
    );

    const stockWithdrawal = await changeDownloaded.execute(
      String(id),
      String(downloaded) === 'true',
    );

    return response.json(stockWithdrawal);
  }

  public async deleteItem(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.query;

    const deleteStockWithdrawalItem = container.resolve(
      DeleteStockWithdrawalItemService,
    );

    await deleteStockWithdrawalItem.execute(String(id));

    return response.status(204).json();
  }
}
