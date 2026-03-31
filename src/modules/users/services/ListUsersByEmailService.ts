import { injectable, inject } from 'tsyringe';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import { User } from '@prisma/client';

@injectable()
class ListUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(email: string): Promise<User[]> {
    const users = await this.userRepository.listByEmail(email);

    return users;
  }
}

export default ListUserService;
