export interface ICreateUserRefreshToken {
  userId: string;
  expiresDate: Date;
  refreshToken: string;
}
