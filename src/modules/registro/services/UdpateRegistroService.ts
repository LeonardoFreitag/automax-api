import AppError from '@shared/errors/AppError';
import IRegistroRepository from '@modules/registro/repositories/IRegistroRepository';
import { injectable, inject } from 'tsyringe';
import { Registro, Prisma } from '@prisma/client';

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
      const newRegistro: Prisma.RegistroUncheckedCreateInput = {
        validade: data.validade,
      };

      const registro = await this.registroRepository.create(newRegistro);

      return registro;
    }

    foundRegistro.validade = data.validade;

    return this.registroRepository.save(foundRegistro);
  }
}

export default UpdateRegistroService;
