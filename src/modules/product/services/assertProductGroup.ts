import { Group } from '@prisma/client';
import AppError from '@shared/errors/AppError';

/**
 * Valida o grupo antes de gravar o produto.
 *
 * Sem isso, um `groupId` vazio ou inexistente só era descoberto pelo Postgres,
 * que respondia com um P2003 em `product_groupId_fkey` — um 500 genérico, sem
 * indicar qual produto nem o que fazer. Aqui o erro vira 400/404 com a
 * instrução de como resolver do lado do ERP.
 *
 * Função pura de propósito: os services do projeto injetam repositórios por
 * token (`@inject('GroupRepository')`), e injeção por tipo não é confiável no
 * runtime de desenvolvimento (tsx/esbuild não emite decorator metadata).
 */
export default function assertProductGroup(
  group: Group | undefined,
  groupId: string,
  customerId: string,
  productCode: string,
): void {
  if (!groupId || groupId.trim() === '') {
    throw new AppError(
      `Produto ${productCode}: groupId não informado. Busque o id do grupo em GET /group?customerId=${customerId} e envie-o no cadastro do produto.`,
      400,
    );
  }

  if (!group) {
    throw new AppError(
      `Produto ${productCode}: grupo ${groupId} não existe. Cadastre o grupo (POST /group) antes de sincronizar o produto.`,
      404,
    );
  }

  if (group.customerId !== customerId) {
    throw new AppError(
      `Produto ${productCode}: o grupo ${groupId} pertence a outro customer.`,
      400,
    );
  }
}
