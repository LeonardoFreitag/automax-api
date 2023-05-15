import { UserRulesModel } from './UserRulesModel';

export interface UserModel {
  id: string;
  customerId: string;
  isAdmin: boolean;
  name: string;
  cellphone: string;
  email: string;
  password: string;
  isComissioned: boolean;
  comissionPercentage: number;
  rules: UserRulesModel[];
}
