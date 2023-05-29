import { Prisma, Group } from '@prisma/client';

export default interface IGroupRepository {
  findByGroup(group: string): Promise<Group | undefined>;
  findById(id: string): Promise<Group | undefined>;
  create(data: Prisma.GroupUncheckedCreateInput): Promise<Group>;
  save(group: Group): Promise<Group>;
  list(customerId: string): Promise<Group[]>;
  delete(id: string): Promise<void>;
}
