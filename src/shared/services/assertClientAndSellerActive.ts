import { Client, User } from '@prisma/client';
import AppError from '@shared/errors/AppError';

/**
 * Última linha de defesa contra lançamento para cliente ou vendedor desativado.
 *
 * Não é redundante com o `ensureAuthenticated`, por dois motivos:
 *
 * - o middleware valida o **usuário do token**, mas `sellerId` vem do corpo da
 *   requisição — nada impede um vendedor ativo (ou o ERP) de lançar em nome de
 *   outro, inclusive de um desativado;
 * - o middleware não olha cliente nenhum, e o app carrega a lista de clientes
 *   uma vez por foco de tela, então um cliente desativado no meio do
 *   atendimento continua na memória dele.
 *
 * Função pura recebendo as entidades já buscadas: os services do projeto
 * injetam repositórios por token de string, e injeção por tipo não é confiável
 * no runtime de desenvolvimento (tsx/esbuild não emite decorator metadata).
 */
export default function assertClientAndSellerActive(
  client: Client | undefined,
  seller: User | undefined,
): void {
  if (!client) {
    throw new AppError('Cliente não encontrado.', 409);
  }

  if (client.isActivated === false) {
    throw new AppError(
      'Este cliente está desativado e não pode receber lançamentos.',
      409,
    );
  }

  if (!seller) {
    throw new AppError('Vendedor não encontrado.', 403);
  }

  if (seller.isActivated === false) {
    throw new AppError(
      'Vendedor desativado. Este lançamento não pode ser feito.',
      403,
    );
  }
}
