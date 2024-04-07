import { injectable, inject } from 'tsyringe';
import IRegistroRepository from '@modules/registro/repositories/IRegistroRepository';
import { Registro } from '@prisma/client';

@injectable()
class ShowRegistroService {
  constructor(
    @inject('RegistroRepository')
    private registroRepository: IRegistroRepository,
  ) {}

  public async execute(id: string): Promise<Registro | undefined> {
    const validade = await this.registroRepository.showValidade(id);

    return validade;
  }
}

export default ShowRegistroService;
