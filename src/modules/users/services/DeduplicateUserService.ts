import { injectable, inject } from 'tsyringe';
import IUserRepository from '@modules/users/repositories/IUserRepository';

@injectable()
class DeduplicateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(id: string, email: string): Promise<void> {
    await this.userRepository.deduplicateUserByEmail(id, email);
  }
}

export default DeduplicateUserService;
