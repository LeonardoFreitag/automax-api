import { ICreateClientTempDTO } from '@modules/clientTemp/dtos/ICreateClientTempDTOS';
import IClientTempRepository from '@modules/clientTemp/repositories/IClientTempRepository';
import { ClientTemp, Prisma } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import { prisma } from '@shared/infra/prisma/prisma';

class ClientTempRepository implements IClientTempRepository {
  public async changeDownloaded(
    id: string,
    downloaded: boolean,
  ): Promise<ClientTemp> {
    const checkClientExists = await this.findById(id);
    if (!checkClientExists) {
      throw new AppError('Client not found', 400);
    }
    const updatedClient = await prisma.clientTemp.update({
      where: {
        id,
      },
      data: {
        downloaded,
      },
    });

    return updatedClient;
  }

  public async listNewClientsTemp(customerId: string): Promise<ClientTemp[]> {
    const foundClient = await prisma.clientTemp.findMany({
      where: {
        customerId,
        downloaded: false,
      },
    });

    return foundClient;
  }

  public async create(data: ICreateClientTempDTO): Promise<ClientTemp> {
    const checkClientExists = await this.findByCnpj(data.cnpj);

    if (checkClientExists) {
      throw new AppError('Client already exists', 400);
    }

    const newClient = await prisma.clientTemp.create({
      data: {
        ...data,
        ClientContactTemp: {
          createMany: {
            data: data.ClientContactTemp as Prisma.ClientContactTempUncheckedCreateInput[],
            skipDuplicates: true,
          },
        },
      },
    });

    return newClient;
  }

  public async findByCnpj(cnpj: string): Promise<ClientTemp | undefined> {
    const foundClient = await prisma.clientTemp.findFirst({
      where: {
        cnpj,
      },
    });

    return foundClient;
  }

  public async findById(id: string): Promise<ClientTemp | undefined> {
    const foundClient = await prisma.clientTemp.findUnique({
      where: {
        id,
      },
    });

    return foundClient;
  }

  public async findByCustomerId(customerId: string): Promise<ClientTemp[]> {
    const foundClient = await prisma.clientTemp.findMany({
      where: {
        customerId,
      },
    });

    return foundClient;
  }

  public async update(cliente: ClientTemp): Promise<ClientTemp> {
    const checkClientExists = await this.findById(cliente.id);
    if (!checkClientExists) {
      throw new AppError('Client not found', 400);
    }
    const updatedClient = await prisma.clientTemp.update({
      where: {
        id: cliente.id,
      },
      data: cliente,
    });

    return updatedClient;
  }

  public async delete(id: string): Promise<void> {
    const foundClient = await this.findById(id);
    if (!foundClient) {
      throw new AppError('Client not found', 400);
    }

    await prisma.clientTemp.delete({
      where: {
        id,
      },
    });
  }
}

export default ClientTempRepository;
