import { injectable, inject } from 'tsyringe';
import IGroupRepository from '@modules/group/repositories/IGroupRepository';
import { Prisma, Group } from '@prisma/client';
import AppError from '@shared/errors/AppError';

@injectable()
class CreateGroupService {
  constructor(
    @inject('GroupRepository')
    private GroupRepository: IGroupRepository,
  ) {}

  public async execute({
    customerId,
    group,
  }: Prisma.GroupUncheckedCreateInput): Promise<Group> {
    const checkGroupExists = await this.GroupRepository.findByGroup(group);

    if (checkGroupExists) {
      throw new AppError('Group already exists!');
    }

    const newGroup = await this.GroupRepository.create({
      customerId,
      group,
    });

    return newGroup;
  }
}

export default CreateGroupService;
