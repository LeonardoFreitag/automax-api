import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateGroupService from '@modules/group/services/CreateGroupService';
import UpdateGroupService from '@modules/group/services/UdpateGroupService';
import ListGroupService from '@modules/group/services/ListGroupService';
import DeleteGroupService from '@modules/group/services/DeleteGroupService';
import DeleteAllGroupsService from '@modules/group/services/DeleteAllGroupsService';

export default class GroupController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { customerId, group } = request.body;

    const createGroup = container.resolve(CreateGroupService);

    const newGroup = await createGroup.execute({
      customerId,
      group,
    });

    return response.json(newGroup);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const updateGroup = container.resolve(UpdateGroupService);

    const updatedGroup = await updateGroup.execute(data);

    return response.json(updatedGroup);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { customerId } = request.query;

    const listGroups = container.resolve(ListGroupService);

    const groupList = await listGroups.execute(String(customerId));

    return response.json(groupList);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteGroupService = container.resolve(DeleteGroupService);

    await deleteGroupService.execute(String(id));

    return response.status(204).json();
  }

  public async deleteAll(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { customerId } = request.query;

    const deleteAllGroupsService = container.resolve(DeleteAllGroupsService);

    await deleteAllGroupsService.execute(String(customerId));

    return response.status(204).json();
  }
}
