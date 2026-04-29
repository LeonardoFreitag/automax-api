import { injectable, inject } from 'tsyringe';
import IPhasesRepository from '@modules/phases/repositories/IPhasesRepository';
import { Phases, Prisma } from '@prisma/client';

@injectable()
class CreatePhasesService {
  constructor(
    @inject('PhasesRepository')
    private phasesRepository: IPhasesRepository,
  ) {}

  public async execute({
    id,
    customerId,
    phase,
    orderPhase,
  }: Prisma.PhasesUncheckedCreateInput): Promise<Phases> {
    const newPhase = await this.phasesRepository.create({
      ...(id && { id }),
      customerId,
      phase,
      orderPhase,
    });

    const duplicates = await this.phasesRepository.findDuplicates(
      String(customerId),
      String(phase),
      newPhase.id,
    );

    for (const duplicate of duplicates) {
      await this.phasesRepository.delete(duplicate.id);
    }

    return newPhase;
  }
}

export default CreatePhasesService;
