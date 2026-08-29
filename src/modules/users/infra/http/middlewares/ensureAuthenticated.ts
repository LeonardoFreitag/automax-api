import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { container } from 'tsyringe';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import IUserRepository from '@modules/users/repositories/IUserRepository';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

/**
 * Cache do status de ativação, para não consultar o banco a cada requisição.
 *
 * A janela é curta de propósito: o requisito é que desativar um vendedor corte
 * o acesso em minutos, não no vencimento do token (que dura 1 dia). 30s atende
 * com folga e mantém o custo por request desprezível.
 */
const STATUS_CACHE_TTL_MS = 30_000;

const statusCache = new Map<
  string,
  { isActivated: boolean; expiresAt: number }
>();

async function isUserActivated(userId: string): Promise<boolean> {
  const cached = statusCache.get(userId);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.isActivated;
  }

  const userRepository = container.resolve<IUserRepository>('UserRepository');
  const user = await userRepository.findById(userId);

  // Usuário apagado enquanto o token ainda era válido conta como inativo.
  const isActivated = Boolean(user) && user.isActivated !== false;

  statusCache.set(userId, {
    isActivated,
    expiresAt: Date.now() + STATUS_CACHE_TTL_MS,
  });

  return isActivated;
}

/**
 * Limpa o cache de um usuário. Chamado ao mudar o status para que a revogação
 * (ou a reativação) valha na requisição seguinte, sem esperar o TTL.
 */
export function invalidateUserStatusCache(userId: string): void {
  statusCache.delete(userId);
}

export default async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  let userId: string;

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as ITokenPayload;

    userId = sub;
  } catch (err) {
    throw new AppError('Invalid JWT token', 401, true);
  }

  // Fora do try acima: um AppError lançado aqui não pode ser convertido em
  // "Invalid JWT token", senão o app trataria revogação como token corrompido.
  if (!(await isUserActivated(userId))) {
    throw new AppError(
      'Acesso desativado. Sua sessão foi encerrada.',
      401,
      true,
    );
  }

  request.user = {
    id: userId,
  };

  next();
}
