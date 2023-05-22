import { injectable, inject } from 'tsyringe';
import IUserRepository from '@modules/users/repositories/IUserRepository';

@injectable()
class DeleteUserRuleService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.userRepository.deleteRule(id);
  }
}

export default DeleteUserRuleService;
