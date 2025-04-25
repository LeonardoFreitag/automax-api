import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateClientTempService from '@modules/clientTemp/services/CreateClientTempService';
import DeleteClientTempService from '@modules/clientTemp/services/DeleteClientTempService';
import FindClientTempByCnpjService from '@modules/clientTemp/services/FindClientByCnpjService';
import ListNewClientTempService from '@modules/clientTemp/services/ListNewClientTempService';
import ChangeDownloadedService from '@modules/clientTemp/services/ChageDownloadedService';

export default class ClientController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      customerId,
      companyName,
      comercialName,
      zipCode,
      streetName,
      streetNumber,
      neighborhood,
      complement,
      cnpj,
      ie,
      cityCode,
      city,
      stateCode,
      state,
      sellerId,
      downloaded,
      phone,
      cellphone,
      email,
      ClientContactTemp,
    } = request.body;

    const createClient = container.resolve(CreateClientTempService);

    const client = await createClient.execute({
      customerId,
      companyName,
      comercialName,
      zipCode,
      streetName,
      streetNumber,
      neighborhood,
      complement,
      cnpj,
      ie,
      cityCode,
      city,
      stateCode,
      state,
      sellerId,
      downloaded,
      phone,
      cellphone,
      email,
      ClientContactTemp,
    });

    return response.json(client);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteClientService = container.resolve(DeleteClientTempService);

    await deleteClientService.execute(String(id));

    return response.status(204).json();
  }

  public async findByCnpj(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { cnpj } = request.query;

    const findClientByCnpjService = container.resolve(
      FindClientTempByCnpjService,
    );

    const client = await findClientByCnpjService.execute(String(cnpj));

    return response.json(client);
  }

  public async listNewClientTemp(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { customerId } = request.query;
    const listNewClientTempService = container.resolve(
      ListNewClientTempService,
    );

    const listClientTemp = await listNewClientTempService.execute(
      String(customerId),
    );

    return response.json(listClientTemp);
  }

  public async changeDownloaded(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id, downloaded } = request.query;

    const changeDownloadedService = container.resolve(ChangeDownloadedService);

    const client = await changeDownloadedService.execute(
      String(id),
      Boolean(downloaded),
    );

    return response.json(client);
  }
}
