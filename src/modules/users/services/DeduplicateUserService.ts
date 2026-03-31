import { injectable, inject } from 'tsyringe';
import IUserRepository from '@modules/users/repositories/IUserRepository';

@injectable()
class DeduplicateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(email: string, customerId: string): Promise<void> {
    await this.userRepository.deduplicateUserByEmail(customerId, email);
  }
}

export default DeduplicateUserService;
