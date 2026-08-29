import IClientRepository from '@modules/client/repositories/IClientRepository';
import {
  Client,
  ClientContact,
  ClientPaymentForm,
  Prisma,
} from '@prisma/client';
import AppError from '@shared/errors/AppError';
import { prisma } from '@shared/infra/prisma/prisma';

class ClientRepository implements IClientRepository {
  /**
   * Apaga as duplicatas de um `code`, preservando o cadastro indicado.
   *
   * A versão anterior confiava cegamente no `clientId`: com ele vazio, o
   * `id: { not: '' }` casava com **todos** os cadastros daquele code — inclusive
   * o que deveria ser preservado. A rota já exige o campo, mas a operação é
   * destrutiva demais para depender só da validação de entrada.
   *
   * Agora o cadastro a preservar precisa existir e pertencer ao mesmo
   * `(customerId, code)`. Se não pertencer, nada é apagado.
   */
  public async deduplicateClient(
    customerId: string,
    clientId: string,
    code: string,
  ): Promise<string> {
    const clientToKeep = await prisma.client.findFirst({
      where: { id: clientId, customerId, code },
    });

    if (!clientToKeep) {
      throw new AppError(
        `O cliente informado não pertence ao código ${code} deste customer. Nenhum cadastro foi removido.`,
        409,
      );
    }

    const result = await prisma.client.deleteMany({
      where: {
        customerId,
        code,
        id: {
          not: clientId,
        },
      },
    });

    return `DeduplicateClientService - deduplicateClient - result: ${result.count}`;
  }

  public async changeActivation(
    id: string,
    isActivated: boolean,
  ): Promise<Client> {
    await prisma.client.update({
      where: {
        id,
      },
      data: {
        isActivated,
      },
    });
    const updatedClient = await prisma.client.findUnique({
      where: {
        id,
      },
    });

    return updatedClient;
  }

  public async findByClientCodePaymentId(
    customerId: string,
    code: string,
    paymentFormId: string,
  ): Promise<ClientPaymentForm> {
    const foundClientPaymentForm = await prisma.client.findFirst({
      where: {
        customerId,
        code,
        ClientPaymentForm: {
          some: {
            paymentFormId,
          },
        },
      },
      include: {
        ClientPaymentForm: true,
      },
    });
    const foundClientPaymentFormPrice =
      foundClientPaymentForm?.ClientPaymentForm.find(
        clientPaymentForm => clientPaymentForm.paymentFormId === paymentFormId,
      );
    return foundClientPaymentFormPrice;
  }

  public async listBySellerId(
    customerId: string,
    sellerId: string,
  ): Promise<Client[]> {
    const listClient = await prisma.client.findMany({
      where: {
        customerId,
        sellerId,
        isActivated: true,
      },
      include: {
        ClientContact: true,
        ClientPaymentForm: true,
      },
      orderBy: {
        companyName: 'asc',
      },
    });
    return listClient;
  }

  public async createManyContact(
    data: Prisma.ClientContactUncheckedCreateInput[],
  ): Promise<void> {
    await prisma.clientContact.createMany({
      data,
    });
  }

  public async createManyPaymentForm(
    data: Prisma.ClientPaymentFormUncheckedCreateInput[],
  ): Promise<void> {
    await prisma.clientPaymentForm.createMany({
      data,
    });
  }

  public async deleteContacts(clientId: string): Promise<void> {
    await prisma.clientContact.deleteMany({
      where: {
        clientId,
      },
    });
  }

  public async deletePaymentForms(clientId: string): Promise<void> {
    await prisma.clientPaymentForm.deleteMany({
      where: {
        clientId,
      },
    });
  }

  public async findContactById(id: string): Promise<ClientContact> {
    const contact = await prisma.clientContact.findUnique({
      where: {
        id,
      },
    });
    return contact;
  }

  public async saveContact(
    clientContact: ClientContact,
  ): Promise<ClientContact> {
    const contact = await prisma.clientContact.update({
      where: {
        id: clientContact.id,
      },
      data: clientContact,
    });

    return contact;
  }

  public async findPaymentFormById(id: string): Promise<ClientPaymentForm> {
    const paymentForm = await prisma.clientPaymentForm.findUnique({
      where: {
        id,
      },
    });
    return paymentForm;
  }

  public async savePaymentForm(
    clientPaymentForm: ClientPaymentForm,
  ): Promise<ClientPaymentForm> {
    const paymentForm = await prisma.clientPaymentForm.update({
      where: {
        id: clientPaymentForm.id,
      },
      data: clientPaymentForm,
    });

    return paymentForm;
  }

  public async createContact(
    data: Prisma.ClientContactUncheckedCreateInput,
  ): Promise<ClientContact> {
    const newContact = await prisma.clientContact.create({
      data: {
        ...data,
      },
    });
    return newContact;
  }

  public async deleteContact(id: string): Promise<void> {
    const foundContact = await prisma.clientContact.findUnique({
      where: {
        id,
      },
    });

    if (!foundContact) {
      throw new AppError('Contact not found', 404);
    }

    await prisma.clientContact.delete({
      where: {
        id,
      },
    });
  }

  public async createPaymentForm(
    data: Prisma.ClientPaymentFormUncheckedCreateInput,
  ): Promise<ClientPaymentForm> {
    const newPaymentForm = await prisma.clientPaymentForm.create({
      data: {
        ...data,
      },
    });

    return newPaymentForm;
  }

  public async deletePaymentForm(id: string): Promise<void> {
    const foundPaymentForm = await prisma.clientPaymentForm.findUnique({
      where: {
        id,
      },
    });

    if (!foundPaymentForm) {
      throw new AppError('Payment form not found', 404);
    }

    await prisma.clientPaymentForm.delete({
      where: {
        id,
      },
    });
  }

  public async findById(id: string): Promise<Client | undefined> {
    const client = await prisma.client.findUnique({
      where: { id },
    });

    return client;
  }

  /**
   * Localiza cliente pelo documento, **escopado pelo customer**.
   *
   * Duas correções em relação à versão anterior, que fazia
   * `findFirst({ where: { cnpj } })`:
   *
   * - sem `customerId`, duas lojas com o mesmo CNPJ na base se atropelavam —
   *   era a única consulta de cliente da aplicação sem escopo;
   * - com `cnpj` vazio (o Joi da rota aplica `.empty('').default('')`), a
   *   consulta casava com o **primeiro cliente sem documento da base inteira**,
   *   de qualquer loja. Documento em branco não identifica ninguém, então aqui
   *   ele simplesmente não busca.
   */
  public async findByCnpj(
    customerId: string,
    cnpj: string,
  ): Promise<Client | undefined> {
    if (!cnpj || cnpj.trim() === '') {
      return undefined;
    }

    const client = await prisma.client.findFirst({
      where: { customerId, cnpj },
    });

    return client;
  }

  public async list(customerId: string): Promise<Client[]> {
    const clients = await prisma.client.findMany({
      where: {
        customerId,
      },
      include: { ClientContact: true, ClientPaymentForm: true },
      orderBy: {
        comercialName: 'asc',
      },
    });

    return clients;
  }

  public async create(clientData: Prisma.ClientCreateInput): Promise<Client> {
    console.log('ClientRepository - create - clientData:', clientData);
    const client = await prisma.client.create({
      data: {
        ...clientData,
        ClientContact: {
          createMany: {
            data: clientData.ClientContact as Prisma.ClientContactUncheckedCreateInput,
          },
        },
        ClientPaymentForm: {
          createMany: {
            data: clientData.ClientPaymentForm as Prisma.ClientPaymentFormUncheckedCreateInput,
          },
        },
      },
    });

    return client;
  }

  public async save(client: Client): Promise<Client> {
    const clientUpdated = await prisma.client.update({
      where: {
        id: client.id,
      },
      data: client,
    });
    return clientUpdated;
  }

  public async delete(id: string): Promise<void> {
    const foundClient = await prisma.client.findUnique({
      where: {
        id,
      },
    });

    if (!foundClient) {
      throw new AppError('Client not found', 404);
    }

    await prisma.client.delete({
      where: {
        id,
      },
    });
  }
}

export default ClientRepository;
