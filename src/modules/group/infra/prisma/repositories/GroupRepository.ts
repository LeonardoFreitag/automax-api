import IGroupRepository from '@modules/group/repositories/IGroupRepository';
import { Prisma, Group } from '@prisma/client';
import { prisma } from '@shared/infra/prisma/prisma';

class GroupRepository implements IGroupRepository {
  public async findByGroup(group: string): Promise<Group> {
    const foundGroup = await prisma.group.findFirst({
      where: { group },
      include: {
        Product: {
          include: {
            ProductPrice: true,
            ProductTissue: true,
          },
        },
      },
    });
    return foundGroup;
  }

  public async findById(id: string): Promise<Group | undefined> {
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        Product: {
          include: {
            ProductPrice: true,
            ProductTissue: true,
          },
        },
      },
    });
    return group;
  }

  public async list(customerId: string): Promise<Group[]> {
    const Groups = await prisma.group.findMany({
      where: {
        customerId,
      },
      include: {
        Product: {
          include: {
            ProductPrice: true,
            ProductTissue: true,
          },
        },
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
    await prisma.group.delete({
      where: {
        id,
      },
    });
  }
}

export default GroupRepository;
