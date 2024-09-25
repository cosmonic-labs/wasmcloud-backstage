import { AuthService, HttpAuthService } from '@backstage/backend-plugin-api';
import { Request } from 'express';

type AuthEnv = { auth: AuthService; httpAuth: HttpAuthService };

export async function getUserToken(req: Request<unknown>, env: AuthEnv) {
  const activeUser = await env.httpAuth.credentials(req);
  const { token } = await env.auth.getPluginRequestToken({
    onBehalfOf: activeUser,
    targetPluginId: 'catalog',
  });
  return token;
}
