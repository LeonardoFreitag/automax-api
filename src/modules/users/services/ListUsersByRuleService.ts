import { injectable, inject } from 'tsyringe';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import { User } from '@prisma/client';

@injectable()
class ListUsersByRuleService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(customerId: string, rule: string): Promise<User[]> {
    const users = await this.userRepository.listByRule(customerId, rule);

    return users;
  }
}

export default ListUsersByRuleService;
