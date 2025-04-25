import { ICreateUserRuleDTO } from './ICreateUserRuleDTO';

export interface ICreateUserDTO {
  customerId: string;
  isAdmin: boolean;
  name: string;
  email: string;
  cellphone: string;
  password: string;
  regionId?: string;
  UserRules?: ICreateUserRuleDTO[];
}
