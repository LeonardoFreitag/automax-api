import { injectable, inject } from 'tsyringe';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import { User } from '@prisma/client';

interface ListUserResponse {
  users: User[];
}

@injectable()
class ListUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(customerId: string): Promise<User[]> {
    const users = await this.userRepository.list(customerId);

    return users;
  }
}

export default ListUserService;
