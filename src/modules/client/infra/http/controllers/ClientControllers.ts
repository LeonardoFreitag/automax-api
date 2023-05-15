import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateClientService from '@modules/client/services/CreateClientService';
import UpdateClientService from '@modules/client/services/UdpateClientService';
import ListClientService from '@modules/client/services/ListClientService';
import DeleteClientService from '@modules/client/services/DeleteClientService';

export default class ClientController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      customerId,
      code,
      companyName,
      comercialName,
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
      contacts,
      financialPendency,
      paymentForm,
      isNew,
    } = request.body;

    const createClient = container.resolve(CreateClientService);

    const Client = await createClient.execute({
      customerId,
      code,
      companyName,
      comercialName,
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
      contacts,
      financialPendency,
      paymentForm,
      isNew,
    });

    return response.json(classToClass(Client));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const updateClient = container.resolve(UpdateClientService);

    const Client = await updateClient.execute(data);

    return response.json(classToClass(Client));
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { customerId } = request.query;

    const listClients = container.resolve(ListClientService);

    const Client = await listClients.execute(String(customerId));

    return response.json(classToClass(Client));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteClientService = container.resolve(DeleteClientService);

    await deleteClientService.execute(String(id));

    return response.status(204).json();
  }
}
