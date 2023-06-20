import { Phases, Prisma } from '@prisma/client';

export default interface IPhasesRepository {
  findById(id: string): Promise<Phases | undefined>;
  create(data: Prisma.PhasesUncheckedCreateInput): Promise<Phases>;
  save(phase: Phases): Promise<Phases>;
  list(phaseId: string): Promise<Phases[]>;
  delete(id: string): Promise<void>;
}
