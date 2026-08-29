import { Prisma } from '@prisma/client';

function hasPrismaErrorCode(error: unknown, code: string): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === code;
  }

  return (error as { code?: string })?.code === code;
}

/**
 * Violação de restrição de unicidade do Postgres (P2002), incluindo colisão de
 * chave primária.
 *
 * Verificação estrutural em vez de `instanceof`: com o driver adapter o erro
 * pode ser reempacotado, e a checagem de instância deixa de valer.
 */
export function isUniqueConstraintError(error: unknown): boolean {
  return hasPrismaErrorCode(error, 'P2002');
}

/**
 * Violação de chave estrangeira (P2003) — inclusive o RESTRICT que impede
 * apagar um registro ainda referenciado por outro.
 */
export function isForeignKeyConstraintError(error: unknown): boolean {
  return hasPrismaErrorCode(error, 'P2003');
}

/** Registro não encontrado em update/delete (P2025). */
export function isRecordNotFoundError(error: unknown): boolean {
  return hasPrismaErrorCode(error, 'P2025');
}
