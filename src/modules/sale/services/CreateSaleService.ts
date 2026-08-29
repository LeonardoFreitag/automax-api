import { injectable, inject } from 'tsyringe';
import ISaleRepository from '@modules/sale/repositories/ISaleRepository';
import IClientRepository from '@modules/client/repositories/IClientRepository';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import assertClientAndSellerActive from '@shared/services/assertClientAndSellerActive';
import assertProductsActive, {
  extractProductIds,
} from '@shared/services/assertProductsActive';
import { Prisma, Sale } from '@prisma/client';
import { isUniqueConstraintError } from '@shared/infra/prisma/isUniqueConstraintError';

export interface ICreateSaleResult {
  sale: Sale;
  /** true quando o pedido já existia e nada foi criado nesta chamada. */
  replayed: boolean;
}

@injectable()
class CreateSaleService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,

    @inject('ClientRepository')
    private clientRepository: IClientRepository,

    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  /**
   * Última linha de defesa contra pedido com produto inativado.
   *
   * O app mantém rascunho local e recarrega a lista de produtos só por foco de
   * tela: um carrinho montado ontem pode conter item que a retaguarda inativou
   * hoje. Uma consulta só, com todos os ids do pedido.
   */
  private async assertProducts(items: unknown): Promise<void> {
    const productIds = extractProductIds(items);

    const inactiveProducts = await this.productRepository.findInactiveByIds(
      productIds,
    );

    assertProductsActive(inactiveProducts);
  }

  /**
   * Última linha de defesa contra pedido de cliente ou vendedor desativado.
   *
   * O app carrega a lista de clientes uma vez por foco de tela, então um
   * cliente desativado no meio do atendimento continua na memória dele. E um
   * vendedor desligado pode ter token válido por até um dia. Nenhum dos dois
   * casos depende de o app estar atualizado — só esta validação garante.
   */
  private async assertClientAndSeller(
    clientId: string,
    sellerId: string,
  ): Promise<void> {
    const [client, seller] = await Promise.all([
      this.clientRepository.findById(clientId),
      this.userRepository.findById(sellerId),
    ]);

    assertClientAndSellerActive(client, seller);
  }

  /**
   * Cria o pedido de forma idempotente quando o app envia `id`.
   *
   * O app usa o id do rascunho local como id do pedido. Isso torna o POST
   * seguro para repetir: se a primeira tentativa gravou mas a resposta se perdeu
   * (timeout, troca de rede, app morto), a segunda encontra o pedido existente e
   * devolve ele em vez de criar um duplicado.
   *
   * Sem `id` o comportamento é o antigo — o banco gera o uuid e não há proteção.
   */
  public async execute({
    id,
    customerId,
    sellerId,
    saleNumber,
    saleDate,
    clientId,
    clientCode,
    amount,
    discount,
    increment,
    total,
    notes,
    saleStatus,
    refusedNotes,
    returnedNotes,
    signatureBase64,
    SaleItems,
    SalePaymentForm,
  }: Prisma.SaleUncheckedCreateInput): Promise<ICreateSaleResult> {
    // A verificação de repetição vem antes da validação: um pedido já gravado
    // não deve ser recusado só porque o cliente foi desativado depois.
    if (id) {
      const existingSale = await this.saleRepository.findById(id);

      if (existingSale) {
        return { sale: existingSale, replayed: true };
      }
    }

    await this.assertClientAndSeller(String(clientId), String(sellerId));
    await this.assertProducts(SaleItems);

    const saleData: Prisma.SaleUncheckedCreateInput = {
      ...(id ? { id } : {}),
      customerId,
      sellerId,
      saleNumber,
      saleDate,
      clientId,
      clientCode,
      amount,
      discount,
      increment,
      total,
      notes,
      saleStatus,
      refusedNotes,
      returnedNotes,
      signatureBase64,
      SaleItems,
      SalePaymentForm,
    };

    try {
      const sale = await this.saleRepository.create(saleData);

      return { sale, replayed: false };
    } catch (error) {
      // Corrida: duas tentativas quase simultâneas passam pela verificação acima
      // e uma delas colide na chave primária. Trata como repetição.
      if (id && isUniqueConstraintError(error)) {
        const existingSale = await this.saleRepository.findById(id);

        if (existingSale) {
          return { sale: existingSale, replayed: true };
        }
      }

      throw error;
    }
  }
}

export default CreateSaleService;
