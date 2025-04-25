import { injectable, inject } from 'tsyringe';
import IGroupRepository from '@modules/group/repositories/IGroupRepository';

@injectable()
class DeleteAllGroupsService {
  constructor(
    @inject('GroupRepository')
    private groupRepository: IGroupRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.groupRepository.deleteAllGroups(id);
  }
}

export default DeleteAllGroupsService;
