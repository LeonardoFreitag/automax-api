import { injectable, inject } from 'tsyringe';

import IUserRepository from '@modules/users/repositories/IUserRepository';

import { Prisma, UserRules } from '@prisma/client';

@injectable()
class CreateUserRuleService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({
    userId,
    rule,
  }: Prisma.UserRulesUncheckedCreateInput): Promise<UserRules> {
    const nweUserRule = await this.userRepository.createRule(userId, rule);

    return nweUserRule;
  }
}

export default CreateUserRuleService;
