import { Phases, Prisma } from '@prisma/client';

export default interface IPhasesRepository {
  findById(id: string): Promise<Phases | undefined>;
  findDuplicates(customerId: string, phase: string, excludeId: string): Promise<Phases[]>;
  create(data: Prisma.PhasesUncheckedCreateInput): Promise<Phases>;
  save(phase: Phases): Promise<Phases>;
  list(phaseId: string): Promise<Phases[]>;
  delete(id: string): Promise<void>;
}
