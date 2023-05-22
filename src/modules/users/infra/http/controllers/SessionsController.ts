import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import RefreshTokenService from '@modules/users/services/RefreshTokenService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token, refreshToken } = await authenticateUser.execute({
      email,
      password,
    });

    return response.json({ user, token, refreshToken });
  }

  public async refresh(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { refreshToken } = request.body;

    const refreshTokenService = container.resolve(RefreshTokenService);

    const newRefreshToken = await refreshTokenService.execute(refreshToken);

    return response.json(newRefreshToken);
  }
}
