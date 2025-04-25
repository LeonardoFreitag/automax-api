import IGroupRepository from '@modules/group/repositories/IGroupRepository';
import { Prisma, Group } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import { prisma } from '@shared/infra/prisma/prisma';

class GroupRepository implements IGroupRepository {
  public async deleteAllGroups(customerId: string): Promise<void> {
    await prisma.group.deleteMany({
      where: {
        customerId,
      },
    });
  }

  public async findByGroup(customerId: string, group: string): Promise<Group> {
    const foundGroup = await prisma.group.findFirst({
      where: { customerId, group },
    });
    return foundGroup;
  }

  public async findById(id: string): Promise<Group | undefined> {
    const group = await prisma.group.findUnique({
      where: { id },
    });
    return group;
  }

  public async list(customerId: string): Promise<Group[]> {
    const Groups = await prisma.group.findMany({
      where: {
        customerId,
      },
    });
    return Groups;
  }

  public async create(
    groupData: Prisma.GroupUncheckedCreateInput,
  ): Promise<Group> {
    const group = await prisma.group.create({
      data: groupData,
    });
    return group;
  }

  public async save(group: Group): Promise<Group> {
    const updatedGroup = await prisma.group.update({
      where: {
        id: group.id,
      },
      data: {
        group: group.group,
      },
    });
    return updatedGroup;
  }

  public async delete(id: string): Promise<void> {
    const foundGroup = await prisma.group.findUnique({
      where: { id },
    });

    if (!foundGroup) {
      throw new AppError('Group not found');
    }

    await prisma.group.delete({
      where: {
        id,
      },
    });
  }
}

export default GroupRepository;
