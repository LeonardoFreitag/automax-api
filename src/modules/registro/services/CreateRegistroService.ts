import { injectable, inject } from 'tsyringe';
import IRegistroRepository from '@modules/registro/repositories/IRegistroRepository';
import { Registro } from '@prisma/client';

@injectable()
class CreateRegistroService {
  constructor(
    @inject('RegistroRepository')
    private RegistroRepository: IRegistroRepository,
  ) {}

  public async execute(id: string, validade: string): Promise<Registro> {
    const checkRegistroExists = await this.RegistroRepository.findById(id);

    if (checkRegistroExists) {
      return checkRegistroExists;
    }

    const newRegistro = await this.RegistroRepository.create(id, validade);

    return newRegistro;
  }
}

export default CreateRegistroService;
