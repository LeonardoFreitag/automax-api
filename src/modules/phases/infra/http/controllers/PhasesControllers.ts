import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreatePhasesService from '@modules/phases/services/CreatePhasesService';
import UpdatePhasesService from '@modules/phases/services/UdpatePhasesService';
import ListPhasesService from '@modules/phases/services/ListPhasesService';
import DeletePhasesService from '@modules/phases/services/DeletePhasesService';

export default class PhasesControllers {
  public async create(request: Request, response: Response): Promise<Response> {
    const { customerId, phase, orderPhase } = request.body;

    const createPhasesService = container.resolve(CreatePhasesService);

    const newPhase = await createPhasesService.execute({
      customerId,
      phase,
      orderPhase,
    });

    return response.json(newPhase);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const updatePhasesServide = container.resolve(UpdatePhasesService);

    const updatedPhase = await updatePhasesServide.execute(data);

    return response.json(updatedPhase);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { customerId } = request.query;

    const listPhasesService = container.resolve(ListPhasesService);

    const listPhases = await listPhasesService.execute(String(customerId));

    return response.json(listPhases);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deletePhasesService = container.resolve(DeletePhasesService);

    await deletePhasesService.execute(String(id));

    return response.status(204).json();
  }
}
