import IRegistroRepository from '@modules/registro/repositories/IRegistroRepository';
import { injectable, inject } from 'tsyringe';
import { Registro } from '@prisma/client';

@injectable()
class UpdateRegistroService {
  constructor(
    @inject('RegistroRepository')
    private registroRepository: IRegistroRepository,
  ) {}

  public async execute(data: Registro): Promise<Registro> {
    const { id } = data;
    const foundRegistro = await this.registroRepository.findById(id);

    if (!foundRegistro) {
      return this.registroRepository.create(id, data.validade);
    }

    foundRegistro.validade = data.validade;

    return this.registroRepository.save(foundRegistro);
  }
}

export default UpdateRegistroService;
