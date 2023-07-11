import IPhasesRepository from '@modules/phases/repositories/IPhasesRepository';
import { Phases, Prisma } from '@prisma/client';
import AppError from '@shared/errors/AppError';

import { prisma } from '@shared/infra/prisma/prisma';

class PhasesRepository implements IPhasesRepository {
  public async findById(id: string): Promise<Phases | undefined> {
    const phases = await prisma.phases.findUnique({
      where: { id },
    });

    return phases;
  }

  public async list(customerId: string): Promise<Phases[]> {
    const phasess = await prisma.phases.findMany({
      where: {
        customerId,
      },
    });

    return phasess;
  }

  public async create(phasesData: Prisma.PhasesCreateInput): Promise<Phases> {
    const phases = await prisma.phases.create({
      data: phasesData,
    });

    return phases;
  }

  public async save(phases: Phases): Promise<Phases> {
    const phasesUpdated = await prisma.phases.update({
      where: {
        id: phases.id,
      },
      data: phases,
    });
    return phasesUpdated;
  }

  public async delete(id: string): Promise<void> {
    const foundPhases = await prisma.phases.findUnique({
      where: { id },
    });

    if (!foundPhases) {
      throw new AppError('Phases not found');
    }

    await prisma.phases.delete({
      where: {
        id,
      },
    });
  }
}

export default PhasesRepository;
