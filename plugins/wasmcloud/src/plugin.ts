import {
  createApiFactory,
  createPlugin,
  discoveryApiRef,
  fetchApiRef,
  createRouteRef,
} from '@backstage/core-plugin-api';

import {
  wasmcloudApiRef,
  WasmCloudBackendClient,
} from '@cosmonic/backstage-plugin-wasmcloud-react';

export const rootRouteRef = createRouteRef({
  id: 'wasmcloud',
});

export const wasmcloudPlugin = createPlugin({
  id: 'wasmcloud',
  apis: [
    createApiFactory({
      api: wasmcloudApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory({ discoveryApi, fetchApi }) {
        return new WasmCloudBackendClient(discoveryApi, fetchApi);
      },
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});
