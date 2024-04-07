import { injectable, inject } from 'tsyringe';
import IRegistroRepository from '@modules/registro/repositories/IRegistroRepository';

@injectable()
class DeleteRegistroService {
  constructor(
    @inject('RegistroRepository')
    private registroRepository: IRegistroRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    await this.registroRepository.delete(id);
  }
}

export default DeleteRegistroService;
