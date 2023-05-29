import { injectable, inject } from 'tsyringe';
import IGroupRepository from '@modules/group/repositories/IGroupRepository';
import { Group } from '@prisma/client';

@injectable()
class ListGroupService {
  constructor(
    @inject('GroupRepository')
    private groupRepository: IGroupRepository,
  ) {}

  public async execute(customerId: string): Promise<Group[] | undefined> {
    const allGroupByidCustomer = await this.groupRepository.list(customerId);

    return allGroupByidCustomer;
  }
}

export default ListGroupService;
