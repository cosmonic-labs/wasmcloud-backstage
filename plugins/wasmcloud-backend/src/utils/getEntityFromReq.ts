import { AuthService, HttpAuthService } from '@backstage/backend-plugin-api';
import { Request } from 'express';
import { validateEntityRef } from './validateEntityRef';
import { getUserToken } from './getUserToken';
import { CatalogApi } from '@backstage/catalog-client';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { InputError } from '@backstage/errors';

type Env = {
  catalogApi: CatalogApi;
  auth: AuthService;
  httpAuth: HttpAuthService;
};

export async function getEntityFromReq(
  req: Request<unknown>,
  { auth, httpAuth, catalogApi }: Env,
): Promise<Entity> {
  const token = await getUserToken(req, { auth, httpAuth });

  const entityRef = validateEntityRef(req.body.entityRef);
  const refString = stringifyEntityRef(entityRef);

  const entity = await catalogApi.getEntityByRef(entityRef, { token });
  if (!entity) throw new InputError(`Entity missing: ${refString}`);

  return entity;
}
