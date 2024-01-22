class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  public readonly tokenExpired?: boolean;

  constructor(message: string, statusCode = 400, tokenExpired = false) {
    this.message = message;
    this.statusCode = statusCode;
    this.tokenExpired = tokenExpired;
  }
}

export default AppError;
