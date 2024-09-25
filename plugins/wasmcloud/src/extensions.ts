import {
  createComponentExtension,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { rootRouteRef, wasmcloudPlugin } from './plugin';

export const EntityWasmCloudOverviewCard = wasmcloudPlugin.provide(
  createComponentExtension({
    name: 'EntityWasmCloudOverviewCard',
    component: {
      lazy: () =>
        import('./components/WasmCloudOverviewCard').then(
          m => m.WasmCloudOverviewCard,
        ),
    },
  }),
);

export const EntityWasmCloudDetailsPage = wasmcloudPlugin.provide(
  createRoutableExtension({
    name: 'EntityWasmCloudDetailsPage',
    component: () =>
      import('./components/WasmCloudDetailsPage').then(
        m => m.WasmCloudDetailsPage,
      ),
    mountPoint: rootRouteRef,
  }),
);
