import { injectable, inject } from 'tsyringe';
import IPhasesRepository from '@modules/phases/repositories/IPhasesRepository';
import { Phases } from '@prisma/client';

@injectable()
class ListPhasesService {
  constructor(
    @inject('PhasesRepository')
    private phasesRepository: IPhasesRepository,
  ) {}

  public async execute(cnpj: string): Promise<Phases[] | undefined> {
    const allPhasess = await this.phasesRepository.list(cnpj);

    return allPhasess;
  }
}

export default ListPhasesService;
