import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateProfileService from '@modules/users/services/UdpateProfileService';
import ListUserService from '@modules/users/services/ListUsersService';
import DeleteUserService from '@modules/users/services/DeleteUserService';
import { classToClass } from 'class-transformer';

export default class UserController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      customerId,
      isAdmin,
      name,
      email,
      cellphone,
      password,
      comissionPercentage,
      isCommissioned,
      rules,
    } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      customerId,
      isAdmin,
      name,
      email,
      cellphone,
      password,
      comissionPercentage,
      isCommissioned,
      rules,
    });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const updateUser = container.resolve(UpdateProfileService);

    const user = await updateUser.execute(data);

    return response.json(classToClass(user));
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { customerId } = request.query;

    const listUsers = container.resolve(ListUserService);

    const user = await listUsers.execute(String(customerId));

    return response.json(classToClass(user));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteUserService = container.resolve(DeleteUserService);

    await deleteUserService.execute(String(id));

    return response.status(204).json();
  }
}
