import { useApi } from '@backstage/core-plugin-api';
import { useAsyncRetry } from 'react-use';
import { useEntity } from '@backstage/plugin-catalog-react';
import { wasmcloudApiRef } from '../apis';

export function useAppOverview() {
  const api = useApi(wasmcloudApiRef);
  const { entity } = useEntity();

  const { loading, value, error, retry } = useAsyncRetry(
    () => api.getApplications({ entity }),
    [],
  );

  return { loading, value, error, retry };
}

export type UseAppOverviewResult = ReturnType<typeof useAppOverview>;
