import { ICreateUserRuleDTO } from './ICreateUserRuleDTO';

export interface ICreateUserDTO {
  id?: string;
  customerId: string;
  isAdmin: boolean;
  name: string;
  email: string;
  cellphone: string;
  password: string;
  regionId?: string;
  UserRules?: ICreateUserRuleDTO[];
}
