import AppError from '@shared/errors/AppError';
import IGroupRepository from '@modules/group/repositories/IGroupRepository';
import { injectable, inject } from 'tsyringe';
import { Group, Prisma } from '@prisma/client';

@injectable()
class UpdateGroupService {
  constructor(
    @inject('GroupRepository')
    private groupRepository: IGroupRepository,
  ) {}

  public async execute(data: Group): Promise<Group> {
    const { id } = data;
    const foundGroup = await this.groupRepository.findById(id);

    if (!foundGroup) {
      const newGroup: Prisma.GroupUncheckedCreateInput = {
        customerId: data.customerId,
        group: data.group,
      };

      const group = await this.groupRepository.create(newGroup);

      return group;
    }

    foundGroup.group = data.group;

    return this.groupRepository.save(foundGroup);
  }
}

export default UpdateGroupService;
