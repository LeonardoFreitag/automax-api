export interface IUpdateUserDTO {
  id?: string;
  customerId: string;
  isAdmin: boolean;
  name: string;
  email: string;
  cellphone: string;
  password: string;
  regionId?: string;
}
