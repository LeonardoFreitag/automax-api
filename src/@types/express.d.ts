declare namespace Express {
  export interface Request {
    user: {
      id: string;
      /** Customer dono do token, resolvido pelo ensureAuthenticated. */
      customerId?: string;
    };
  }
}
