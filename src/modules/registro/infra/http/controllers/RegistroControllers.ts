import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateRegistroService from '@modules/registro/services/CreateRegistroService';
import UpdateRegistroService from '@modules/registro/services/UdpateRegistroService';
import ShowRegistroService from '@modules/registro/services/ShowRegistroService';
import DeleteRegistroService from '@modules/registro/services/DeleteRegistroService';
import ListRegistrosService from '@modules/registro/services/ListRegistrosService';

export default class RegistroController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id, validade } = request.body;

    const createRegistro = container.resolve(CreateRegistroService);

    const newRegistro = await createRegistro.execute(
      String(id),
      String(validade),
    );

    return response.json(newRegistro);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const updateRegistro = container.resolve(UpdateRegistroService);

    const updatedRegistro = await updateRegistro.execute(data);

    return response.json(updatedRegistro);
  }

  public async showValidade(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.query;

    const showRegistro = container.resolve(ShowRegistroService);

    const registro = await showRegistro.execute(String(id));

    return response.json(registro);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const listRegistrosService = container.resolve(ListRegistrosService);

    const registros = await listRegistrosService.execute();

    return response.json(registros);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.query;

    const deleteRegistroService = container.resolve(DeleteRegistroService);

    await deleteRegistroService.execute(String(id));

    return response.status(204).json();
  }
}
