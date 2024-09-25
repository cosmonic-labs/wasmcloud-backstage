import { Entity } from '@backstage/catalog-model';
import { createApiRef } from '@backstage/core-plugin-api';
import type {
  ApplicationHistory,
  ApplicationManifest,
  ApplicationStatus,
  ApplicationSummary,
} from '@wasmcloud/lattice-client-core';

export type ApplicationOverview = {
  lattice: string;
  summary: ApplicationSummary;
  status: ApplicationStatus;
  manifest: ApplicationManifest;
  versions: ApplicationHistory;
};

export const wasmcloudApiRef = createApiRef<WasmCloudApi>({
  id: 'plugin.wasmcloud',
});

export interface WasmCloudApi {
  getApplications({
    entity,
  }: {
    entity: Entity;
  }): Promise<ApplicationOverview[]>;
}
