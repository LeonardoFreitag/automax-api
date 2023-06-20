import { injectable, inject } from 'tsyringe';
import IPhasesRepository from '@modules/phases/repositories/IPhasesRepository';

@injectable()
class DeletePhasesService {
  constructor(
    @inject('PhasesRepository')
    private phasesRepository: IPhasesRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.phasesRepository.delete(id);
  }
}

export default DeletePhasesService;
