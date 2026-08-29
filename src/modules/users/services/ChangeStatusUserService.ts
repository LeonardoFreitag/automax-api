import { injectable, inject } from 'tsyringe';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IUserRefreshTokensRepository from '@modules/users/repositories/IUserRefreshTokensRepository';
import { invalidateUserStatusCache } from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { User } from '@prisma/client';

/**
 * Ativa ou desativa um vendedor.
 *
 * Desativar bloqueia o login (403 em AuthenticateUserService), invalida o token
 * em uso (401 em ensureAuthenticated), corta a renovação (401 em
 * RefreshTokenService) e recusa novos lançamentos (403 em CreateSaleService e
 * CreateBudgetService) — sem apagar nada. Reativar devolve tudo ao normal.
 */
@injectable()
class ChangeStatusUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('UserRefreshTokensRepository')
    private userRefreshTokensRepository: IUserRefreshTokensRepository,
  ) {}

  public async execute(id: string, isActivated: boolean): Promise<User> {
    const updatedUser = await this.userRepository.changeActivation(
      id,
      isActivated,
    );

    // Sem isto a revogação só valeria depois do TTL do cache do middleware.
    invalidateUserStatusCache(id);

    if (!isActivated) {
      // Descarta a credencial em vez de deixá-la válida por 30 dias e inerte.
      // Reativar exige login novo, o que é o comportamento desejado.
      await this.userRefreshTokensRepository.deleteAllByUserId(id);
    }

    return updatedUser;
  }
}

export default ChangeStatusUserService;
