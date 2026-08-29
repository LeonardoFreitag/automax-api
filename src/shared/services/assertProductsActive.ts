import { Product } from '@prisma/client';
import AppError from '@shared/errors/AppError';

/**
 * Última linha de defesa contra lançamento de produto inativado.
 *
 * Não é redundante com o filtro das rotas de listagem. O app carrega a lista de
 * produtos por foco de tela e mantém rascunho local do pedido: um vendedor pode
 * ter montado o carrinho ontem, com a lista de ontem, e enviar hoje — depois de
 * a retaguarda ter inativado o item. Só esta validação pega esse caso.
 *
 * A mensagem nomeia os produtos de propósito. Recusar um pedido de doze itens
 * com "produto inativo" obrigaria o vendedor a descobrir qual por tentativa e
 * erro, e o rascunho ficaria travado no aparelho até ele acertar.
 *
 * Função pura recebendo as entidades já buscadas, pelo mesmo motivo de
 * `assertClientAndSellerActive`: os services injetam repositórios por token de
 * string, e injeção por tipo não é confiável no runtime de desenvolvimento
 * (tsx/esbuild não emite decorator metadata).
 */
export default function assertProductsActive(
  inactiveProducts: Product[],
): void {
  if (inactiveProducts.length === 0) {
    return;
  }

  const names = inactiveProducts
    .map(product => `${product.code} - ${product.description}`)
    .join('; ');

  const prefix =
    inactiveProducts.length === 1
      ? 'O produto abaixo foi inativado pela retaguarda'
      : 'Os produtos abaixo foram inativados pela retaguarda';

  throw new AppError(
    `${prefix} e não pode mais ser vendido: ${names}. Remova do pedido e envie novamente.`,
    409,
  );
}

/**
 * Extrai os productId de um array de itens de venda/orçamento.
 *
 * `SaleItems`/`BudgetItems` chegam no create input tipados como estrutura
 * aninhada do Prisma, mas em runtime são o array cru que o app enviou — o
 * repositório é quem embrulha em `createMany`. Daí o unknown e a checagem
 * defensiva: um payload fora do formato não deve derrubar o POST aqui, e sim
 * seguir para o erro do Prisma, que diz exatamente o que está errado.
 */
export function extractProductIds(items: unknown): string[] {
  if (!Array.isArray(items)) {
    return [];
  }

  const ids = items
    .map(item =>
      item && typeof item === 'object'
        ? (item as { productId?: unknown }).productId
        : undefined,
    )
    .filter((id): id is string => typeof id === 'string' && id !== '');

  return Array.from(new Set(ids));
}
