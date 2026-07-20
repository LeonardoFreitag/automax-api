import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateInventoryService from '@modules/inventory/services/CreateInventoryService';
import CreateInventoryItemService from '@modules/inventory/services/CreateInventoryItemService';
import ListInventoryService from '@modules/inventory/services/ListInventoryService';
import ListInventoryItemsService from '@modules/inventory/services/ListInventoryItemsService';
import UpdateInventoryStatusService from '@modules/inventory/services/UpdateInventoryStatusService';
import ChangeInventoryDownloadedService from '@modules/inventory/services/ChangeInventoryDownloadedService';
import DeleteInventoryItemService from '@modules/inventory/services/DeleteInventoryItemService';

export default class InventoryController {
  // usuário inicia um novo inventário no almoxarifado
  public async create(request: Request, response: Response): Promise<Response> {
    const { customerId, userId, userName } = request.body;

    const createInventory = container.resolve(CreateInventoryService);

    const inventory = await createInventory.execute({
      customerId,
      userId,
      userName,
    });

    return response.json(inventory);
  }

  // registra a contagem de um produto (chamado a cada leitura/busca no app)
  public async createItem(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const {
      inventoryId,
      stockProductId,
      code,
      reference,
      description,
      unity,
      quantity,
    } = request.body;

    const createInventoryItem = container.resolve(CreateInventoryItemService);

    const item = await createInventoryItem.execute({
      inventoryId,
      stockProductId,
      code,
      reference,
      description,
      unity,
      quantity,
    });

    return response.json(item);
  }

  // lista inventários do customer. Sem o filtro "downloaded", lista todos
  // (uso do app, ex.: retomar inventário em andamento). Com downloaded=false,
  // é a consulta que o ERP usa para saber o que ainda precisa processar.
  public async list(request: Request, response: Response): Promise<Response> {
    const { customerId, downloaded } = request.query;

    // console.log('customerId', customerId);

    const listInventories = container.resolve(ListInventoryService);

    const inventories = await listInventories.execute(
      String(customerId),
      downloaded === undefined ? undefined : downloaded === 'true',
    );

    return response.json(inventories);
  }

  public async listItems(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { inventoryId } = request.query;

    const listInventoryItems = container.resolve(ListInventoryItemsService);

    const items = await listInventoryItems.execute(String(inventoryId));

    return response.json(items);
  }

  // usuário finaliza a contagem no app ("Concluir inventário")
  public async updateStatus(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id, status } = request.body;

    const updateInventoryStatus = container.resolve(
      UpdateInventoryStatusService,
    );

    const inventory = await updateInventoryStatus.execute(id, status);

    return response.json(inventory);
  }

  // ERP marca como processado depois de gravar no Firebird
  public async changeDownloaded(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id, downloaded } = request.query;

    const changeDownloaded = container.resolve(
      ChangeInventoryDownloadedService,
    );

    const inventory = await changeDownloaded.execute(
      String(id),
      String(downloaded) === 'true',
    );

    return response.json(inventory);
  }

  public async deleteItem(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.query;

    const deleteInventoryItem = container.resolve(DeleteInventoryItemService);

    await deleteInventoryItem.execute(String(id));

    return response.status(204).json();
  }
}
