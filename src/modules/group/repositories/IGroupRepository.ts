import { Prisma, Group } from '@prisma/client';

export default interface IGroupRepository {
  findByGroup(customerId: string, group: string): Promise<Group | undefined>;
  findById(id: string): Promise<Group | undefined>;
  create(data: Prisma.GroupUncheckedCreateInput): Promise<Group>;
  save(group: Group): Promise<Group>;
  list(customerId: string): Promise<Group[]>;
  delete(id: string): Promise<void>;
  deleteAllGroups(customerId: string): Promise<void>;
}
