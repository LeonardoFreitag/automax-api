import IPhasesRepository from '@modules/phases/repositories/IPhasesRepository';
import { injectable, inject } from 'tsyringe';
import { Phases } from '@prisma/client';

@injectable()
class UpdatePhasesService {
  constructor(
    @inject('PhasesRepository')
    private phasesRepository: IPhasesRepository,
  ) {}

  public async execute(data: Phases): Promise<Phases> {
    const { id } = data;
    const phaseUpdate = await this.phasesRepository.findById(id);

    if (!phaseUpdate) {
      const newPhase = await this.phasesRepository.create({
        customerId: data.customerId,
        phase: data.phase,
        orderPhase: data.orderPhase,
      });

      return newPhase;
    }

    phaseUpdate.customerId = data.customerId;
    phaseUpdate.phase = data.phase;
    phaseUpdate.orderPhase = data.orderPhase;

    return this.phasesRepository.save(phaseUpdate);
  }
}

export default UpdatePhasesService;
