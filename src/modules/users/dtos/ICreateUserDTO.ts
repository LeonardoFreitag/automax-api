import { ICreateUserRulesDTO } from './ICreateUserRulesDTO';

export default interface ICreateUserDTO {
  customerId: string;
  isAdmin: boolean;
  name: string;
  cellphone: string;
  email: string;
  password: string;
  isCommissioned: boolean;
  comissionPercentage: number;
  rules: ICreateUserRulesDTO[];
}
