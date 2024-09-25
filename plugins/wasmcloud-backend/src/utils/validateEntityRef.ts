import { parseEntityRef } from '@backstage/catalog-model';
import { InputError } from '@backstage/errors';

export function validateEntityRef(ref: unknown) {
  if (!ref) throw new InputError('field is required');

  if (typeof ref !== 'string') throw new InputError('field must be a string');

  try {
    return parseEntityRef(ref);
  } catch (error) {
    throw new InputError(`Invalid entity ref, ${error}`);
  }
}
