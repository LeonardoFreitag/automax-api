import { injectable, inject } from 'tsyringe';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import { User } from '@prisma/client';

@injectable()
class FindAdminByCustomerIdService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(customerId: string): Promise<User> {
    const users = await this.userRepository.findAdminByCustomerId(customerId);

    return users;
  }
}

export default FindAdminByCustomerIdService;
