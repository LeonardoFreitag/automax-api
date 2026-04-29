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
    if (id) {
      await this.phasesRepository.deleteDuplicates(
        String(customerId),
        String(phase),
        String(id),
      );

      const existsPhase = await this.phasesRepository.findById(String(id));

      if (existsPhase) {
        existsPhase.customerId = customerId;
        existsPhase.phase = phase;
        existsPhase.orderPhase = orderPhase;

        return this.phasesRepository.save(existsPhase);
      }
    }
    const newPhase = await this.phasesRepository.create({
      ...(id && { id }),
      customerId,
      phase,
      orderPhase,
    });

    return newPhase;
  }
}

export default CreatePhasesService;
