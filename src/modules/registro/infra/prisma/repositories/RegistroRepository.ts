import IRegistroRepository from '@modules/registro/repositories/IRegistroRepository';
import { Registro } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import { prisma } from '@shared/infra/prisma/prisma';

class RegistroRepository implements IRegistroRepository {
  public async list(): Promise<Registro[]> {
    const registros = await prisma.registro.findMany();
    return registros;
  }

  public async findById(id: string): Promise<Registro | undefined> {
    const registro = await prisma.registro.findUnique({
      where: { id },
    });
    return registro;
  }

  public async showValidade(id: string): Promise<Registro | undefined> {
    const registro = await prisma.registro.findFirst({
      where: {
        id,
      },
    });
    return registro;
  }

  public async create(id: string, validade: string): Promise<Registro> {
    const registro = await prisma.registro.create({
      data: {
        id,
        validade,
      },
    });
    return registro;
  }

  public async save(registro: Registro): Promise<Registro> {
    const updatedRegistro = await prisma.registro.update({
      where: {
        id: registro.id,
      },
      data: {
        validade: registro.validade,
      },
    });
    return updatedRegistro;
  }

  public async delete(id: string): Promise<void> {
    const foundRegistro = await prisma.registro.findUnique({
      where: { id },
    });

    if (!foundRegistro) {
      throw new AppError('Registro not found');
    }

    await prisma.registro.delete({
      where: {
        id,
      },
    });
  }
}

export default RegistroRepository;
