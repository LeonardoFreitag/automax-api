import { injectable, inject } from 'tsyringe';
import IRegistroRepository from '@modules/registro/repositories/IRegistroRepository';
import { Registro } from '@prisma/client';

@injectable()
class ListRegistrosService {
  constructor(
    @inject('RegistroRepository')
    private registroRepository: IRegistroRepository,
  ) {}

  public async execute(): Promise<Registro[]> {
    const validade = await this.registroRepository.list();

    return validade;
  }
}

export default ListRegistrosService;
