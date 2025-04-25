import { BudgetPaymentFormModel } from './BudgetPaymentFormModel';
import { BudgetItemsModel } from './BudgetItemsModel';
import { UserModel } from './UserModel';
import { ClientModel } from './ClientModel';

export interface BudgetModel {
  id: string;
  customerId: string;
  sellerId: string;
  Seller?: UserModel | null;
  budgetNumber: string;
  budgetDate: Date;
  budgetExpiration: Date;
  clientId: string;
  Client?: ClientModel | null;
  amount: number;
  discount: number;
  increment: number;
  total: number;
  notes?: string | null;
  budgetStatus: 'open' | 'waiting' | 'effected' | 'expired' | 'canceled';
  refusedNotes: string;
  returnedNotes: string;
  budgetFileName?: string | null;
  budgetFileUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  BudgetItems: BudgetItemsModel[];
  BudgetPaymentForm: BudgetPaymentFormModel[];
}
