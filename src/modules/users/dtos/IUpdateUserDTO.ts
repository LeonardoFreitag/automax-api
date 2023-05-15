import { ICreateUserRulesDTO } from './ICreateUserRulesDTO';

export default interface IUpdateUserDTO {
  id: string;
  customerId: string;
  isAdmin: boolean;
  name: string;
  cellphone: string;
  email: string;
  isCommissioned: boolean;
  comissionPercentage: number;
  rules: ICreateUserRulesDTO[];
}
