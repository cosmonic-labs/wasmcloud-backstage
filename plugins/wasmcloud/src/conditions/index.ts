import { Entity } from '@backstage/catalog-model';
import { WASMCLOUD_ANNOTATION } from '@cosmonic/backstage-plugin-wasmcloud-common';

export function isWasmCloudAvailable(entity?: Entity): boolean {
  return Boolean(entity?.metadata?.annotations?.[WASMCLOUD_ANNOTATION]);
}
