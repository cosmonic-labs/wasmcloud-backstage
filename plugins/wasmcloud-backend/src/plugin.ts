import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import { WasmCloudBuilder } from './service/WasmCloudBuilder';

/**
 * wasmcloudPlugin backend plugin
 *
 * @public
 */
export const wasmcloudPlugin = createBackendPlugin({
  pluginId: 'wasmcloud',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        catalogApi: catalogServiceRef,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
      },
      async init({ httpRouter, logger, config, catalogApi, auth, httpAuth }) {
        if (config.has('wasmcloud')) {
          const builder = WasmCloudBuilder.create({
            config: config.getConfig('wasmcloud'),
            logger,
            catalogApi,
            auth,
            httpAuth,
          });

          const { router } = await builder.build();

          httpRouter.use(router);
        } else {
          logger.warn('Init failure: Missing configuration.');
        }
      },
    });
  },
});
