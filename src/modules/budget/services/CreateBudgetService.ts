import { injectable, inject } from 'tsyringe';
import IBudgetRepository from '@modules/budget/repositories/IBudgetRepository';
import IClientRepository from '@modules/client/repositories/IClientRepository';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import assertClientAndSellerActive from '@shared/services/assertClientAndSellerActive';
import assertProductsActive, {
  extractProductIds,
} from '@shared/services/assertProductsActive';
import { Prisma, Budget } from '@prisma/client';
import { isUniqueConstraintError } from '@shared/infra/prisma/isUniqueConstraintError';

export interface ICreateBudgetResult {
  budget: Budget;
  /** true quando o orçamento já existia e nada foi criado nesta chamada. */
  replayed: boolean;
}

@injectable()
class CreateBudgetService {
  constructor(
    @inject('BudgetRepository')
    private budgetRepository: IBudgetRepository,

    @inject('ClientRepository')
    private clientRepository: IClientRepository,

    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  /**
   * Última linha de defesa contra orçamento com produto inativado. Mesmo
   * motivo do pedido: o rascunho local pode ser mais velho que a inativação.
   */
  private async assertProducts(items: unknown): Promise<void> {
    const productIds = extractProductIds(items);

    const inactiveProducts = await this.productRepository.findInactiveByIds(
      productIds,
    );

    assertProductsActive(inactiveProducts);
  }

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
   * Cria o orçamento de forma idempotente quando o app envia `id` — o id do
   * rascunho local. Repetir o POST devolve o orçamento existente em vez de
   * duplicar.
   */
  public async execute({
    id,
    customerId,
    sellerId,
    budgetNumber,
    budgetDate,
    budgetExpiration,
    clientId,
    clientCode,
    amount,
    discount,
    increment,
    total,
    notes,
    budgetStatus,
    refusedNotes,
    returnedNotes,
    BudgetItems,
    BudgetPaymentForm,
  }: Prisma.BudgetUncheckedCreateInput): Promise<ICreateBudgetResult> {
    // A verificação de repetição vem antes da validação: um orçamento já
    // gravado não deve ser recusado só porque o cliente foi desativado depois.
    if (id) {
      const existingBudget = await this.budgetRepository.findById(id);

      if (existingBudget) {
        return { budget: existingBudget, replayed: true };
      }
    }

    await this.assertClientAndSeller(String(clientId), String(sellerId));
    await this.assertProducts(BudgetItems);

    const budgetData: Prisma.BudgetUncheckedCreateInput = {
      ...(id ? { id } : {}),
      customerId,
      sellerId,
      budgetNumber,
      budgetDate,
      budgetExpiration,
      clientId,
      clientCode,
      amount,
      discount,
      increment,
      total,
      notes,
      budgetStatus,
      refusedNotes,
      returnedNotes,
      BudgetItems,
      BudgetPaymentForm,
    };

    try {
      const budget = await this.budgetRepository.create(budgetData);

      return { budget, replayed: false };
    } catch (error) {
      // Corrida entre duas tentativas quase simultâneas.
      if (id && isUniqueConstraintError(error)) {
        const existingBudget = await this.budgetRepository.findById(id);

        if (existingBudget) {
          return { budget: existingBudget, replayed: true };
        }
      }

      throw error;
    }
  }
}

export default CreateBudgetService;
