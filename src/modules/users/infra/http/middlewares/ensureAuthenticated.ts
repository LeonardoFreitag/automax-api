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
 * Cache do contexto do usuário (status + customer), para não consultar o banco
 * a cada requisição.
 *
 * A janela é curta de propósito: o requisito é que desativar um vendedor corte
 * o acesso em minutos, não no vencimento do token (que dura 1 dia). 30s atende
 * com folga e mantém o custo por request desprezível.
 */
const STATUS_CACHE_TTL_MS = 30_000;

interface IUserContext {
  isActivated: boolean;
  /** Customer dono do token. Undefined só se o usuário sumiu do banco. */
  customerId?: string;
}

const statusCache = new Map<string, IUserContext & { expiresAt: number }>();

async function loadUserContext(userId: string): Promise<IUserContext> {
  const cached = statusCache.get(userId);

  if (cached && cached.expiresAt > Date.now()) {
    return { isActivated: cached.isActivated, customerId: cached.customerId };
  }

  const userRepository = container.resolve<IUserRepository>('UserRepository');
  const user = await userRepository.findById(userId);

  // Usuário apagado enquanto o token ainda era válido conta como inativo.
  const context: IUserContext = {
    isActivated: Boolean(user) && user.isActivated !== false,
    customerId: user?.customerId,
  };

  statusCache.set(userId, {
    ...context,
    expiresAt: Date.now() + STATUS_CACHE_TTL_MS,
  });

  return context;
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
  const { isActivated, customerId } = await loadUserContext(userId);

  if (!isActivated) {
    throw new AppError(
      'Acesso desativado. Sua sessão foi encerrada.',
      401,
      true,
    );
  }

  // O customer vem do token, não do corpo da requisição. Rotas que precisam
  // isolar dados por cliente (stonePayment, por exemplo) usam isto em vez de
  // confiar no customerId enviado pelo PDV/app.
  request.user = {
    id: userId,
    customerId,
  };

  next();
}
