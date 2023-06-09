import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';
import CreateUserRuleService from '@modules/users/services/CreateUserRuleService';
import UpdateUserService from '@modules/users/services/UdpateUserService';
import UpateEmailUserAdminService from '@modules/users/services/UdpateEmailUserAdminService';
import ListUserService from '@modules/users/services/ListUsersService';
import ListUsersByRuleService from '@modules/users/services/ListUsersByRuleService';
import DeleteUserService from '@modules/users/services/DeleteUserService';
import DeleteUserRuleService from '@modules/users/services/DeleteUserRuleService';

export default class UserController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      customerId,
      isAdmin,
      name,
      email,
      cellphone,
      password,
      regionId,
      UserRules,
    } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      customerId,
      isAdmin,
      name,
      email,
      cellphone,
      password,
      regionId,
      UserRules,
    });

    return response.json(user);
  }

  public async createRule(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { userId, rule } = request.body;

    const createUserRule = container.resolve(CreateUserRuleService);

    const user = await createUserRule.execute({
      userId,
      rule,
    });

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body;
    const { rules } = request.body;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute(data, rules);

    return response.json(user);
  }

  public async updateEmailUserAdmin(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { customerId, old_email, new_email } = request.query;

    const updateUser = container.resolve(UpateEmailUserAdminService);

    const user = await updateUser.execute(
      String(customerId),
      String(old_email),
      String(new_email),
    );

    return response.json(user);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { customerId } = request.query;

    const listUsers = container.resolve(ListUserService);

    const user = await listUsers.execute(String(customerId));

    return response.json(user);
  }

  public async listByRule(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { customerId, rule } = request.query;

    const listUsers = container.resolve(ListUsersByRuleService);

    const userList = await listUsers.execute(String(customerId), String(rule));

    return response.json(userList);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteUserService = container.resolve(DeleteUserService);

    await deleteUserService.execute(String(id));

    return response.status(204).json();
  }

  public async deleteRule(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.query;

    const deleteUserRuleService = container.resolve(DeleteUserRuleService);

    await deleteUserRuleService.execute(String(id));

    return response.status(204).json();
  }
}
