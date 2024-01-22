import { injectable, inject } from 'tsyringe';
import { differenceInHours } from 'date-fns';
import AppError from '@shared/errors/AppError';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('UserTokensRepository')
    private userTokenRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists', 404);
    }

    const user = await this.userRepository.findById(userToken.userId);

    if (!user) {
      throw new AppError('User does not exists', 404);
    }

    const tokenCreatedAt = userToken.createdAt;

    if (differenceInHours(new Date(Date.now()), new Date(tokenCreatedAt)) > 2) {
      throw new AppError('Token expired!', 401);
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.userRepository.save(user);
  }
}

export default ResetPasswordService;
