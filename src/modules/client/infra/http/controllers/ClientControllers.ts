import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateClientService from '@modules/client/services/CreateClientService';
import CreateClientContactService from '@modules/client/services/CreateClientContactService';
import CreateClientPaymentFormService from '@modules/client/services/CreateClientPaymentFormService';
import UpdateClientService from '@modules/client/services/UdpateClientService';
import UpdateClientContactService from '@modules/client/services/UdpateClientContactService';
import UpdateClientPaymentFormService from '@modules/client/services/UdpateClientPaymentFormService';
import ListClientService from '@modules/client/services/ListClientService';
import ListByClientPaymentIdService from '@modules/client/services/ListByClientPaymentIdService';
import ListClientBySellerIdService from '@modules/client/services/ListClientBySellerIdService';
import DeleteClientService from '@modules/client/services/DeleteClientService';
import DeleteClientContactService from '@modules/client/services/DeleteClientContactService';
import DeleteClientPaymentFormService from '@modules/client/services/DeleteClientPaymentFormService';
import ChangeStatusClienteService from '@modules/client/services/ChangeStatusClienteService';

interface PaymentFormUpdateModel {
  paymentFormId: string;
  description: string;
  installmentsLimit: number;
  clientId: string;
}

interface ContactUpdateModel {
  name: string;
  fone: string;
  foneType: string;
  isWhatsApp: boolean;
  email: string;
  job: string;
  clientId: string;
}

export default class ClientController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      customerId,
      code,
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
      financialPendency,
      isNew,
      sellerId,
      ClientContact,
      ClientPaymentForm,
    } = request.body;

    const createClient = container.resolve(CreateClientService);

    const client = await createClient.execute({
      customerId,
      code,
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
      financialPendency,
      isNew,
      sellerId,
      ClientContact,
      ClientPaymentForm,
    });

    return response.json(client);
  }

  public async createContact(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { name, fone, foneType, isWhatsApp, email, job, clientId } =
      request.body;

    const createClientContact = container.resolve(CreateClientContactService);

    const clientContact = await createClientContact.execute({
      name,
      fone,
      foneType,
      isWhatsApp,
      email,
      job,
      clientId,
    });

    return response.json(clientContact);
  }

  public async createPaymentForm(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { paymentFormId, description, installmentsLimit, clientId } =
      request.body;

    const createClientPaymentForm = container.resolve(
      CreateClientPaymentFormService,
    );

    const clientContact = await createClientPaymentForm.execute({
      paymentFormId,
      description,
      installmentsLimit,
      clientId,
    });

    return response.json(clientContact);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const { contacts, paymentForms } = request.body;

    const contactList: ContactUpdateModel[] = contacts.map(
      (item: ContactUpdateModel) => {
        return {
          name: item.name,
          fone: item.fone,
          foneType: item.foneType,
          isWhatsApp: item.isWhatsApp,
          email: item.email,
          job: item.job,
          clientId: data.id,
        };
      },
    );

    const paymentFormList: PaymentFormUpdateModel[] = paymentForms.map(
      (item: PaymentFormUpdateModel) => {
        return {
          paymentFormId: item.paymentFormId,
          description: item.description,
          installmentsLimit: item.installmentsLimit,
          clientId: data.id,
        };
      },
    );

    const updateClient = container.resolve(UpdateClientService);

    const updatedClient = await updateClient.execute(
      data,
      contactList,
      paymentFormList,
    );

    return response.json(updatedClient);
  }

  public async updateContact(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const data = request.body;

    const updateClientContact = container.resolve(UpdateClientContactService);

    const contact = await updateClientContact.execute(data);

    return response.json(contact);
  }

  public async updatePaymentForm(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const data = request.body;

    const updateClientPamentForm = container.resolve(
      UpdateClientPaymentFormService,
    );

    const paymentForm = await updateClientPamentForm.execute(data);

    return response.json(paymentForm);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { customerId } = request.query;

    const listClients = container.resolve(ListClientService);

    const Client = await listClients.execute(String(customerId));

    return response.json(Client);
  }

  public async listBySellerId(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { customerId, sellerId } = request.query;

    const listClients = container.resolve(ListClientBySellerIdService);

    const Client = await listClients.execute(
      String(customerId),
      String(sellerId),
    );

    return response.json(Client);
  }

  public async listByClientCodePaymentId(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { customerId, code, paymentFormId } = request.query;

    const paymentForm = container.resolve(ListByClientPaymentIdService);

    const Client = await paymentForm.execute(
      String(customerId),
      String(code),
      String(paymentFormId),
    );

    return response.json(Client);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteClientService = container.resolve(DeleteClientService);

    await deleteClientService.execute(String(id));

    return response.status(204).json();
  }

  public async changeClientStatus(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id, isActivated } = request.body;

    const changeClientStatusService = container.resolve(
      ChangeStatusClienteService,
    );

    const updatedClient = await changeClientStatusService.execute(
      String(id),
      Boolean(isActivated),
    );

    return response.json(updatedClient);
  }

  public async deleteContact(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.query;

    const deleteClientContactService = container.resolve(
      DeleteClientContactService,
    );

    await deleteClientContactService.execute(String(id));

    return response.status(204).json();
  }

  public async deletePaymentForm(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.query;

    const deleteClientPaymentFormService = container.resolve(
      DeleteClientPaymentFormService,
    );

    await deleteClientPaymentFormService.execute(String(id));

    return response.status(204).json();
  }
}
