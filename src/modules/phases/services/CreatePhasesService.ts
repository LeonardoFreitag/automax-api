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
    customerId,
    phase,
    orderPhase,
  }: Prisma.PhasesUncheckedCreateInput): Promise<Phases> {
    const newPhase = await this.phasesRepository.create({
      customerId,
      phase,
      orderPhase,
    });

    return newPhase;
  }
}

export default CreatePhasesService;
