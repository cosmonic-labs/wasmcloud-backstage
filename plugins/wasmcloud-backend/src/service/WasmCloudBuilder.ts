import {
  AuthService,
  HttpAuthService,
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { CatalogApi } from '@backstage/catalog-client';
import express, { Router } from 'express';

import { WasmCloudLatticeSupplier } from '../types';
import { BackstageLatticeClient } from '../lib/BackstageLatticeClient';
import { ConfigLatticeSupplier } from '../lattice-supplier/ConfigLatticeSupplier';
import { getEntityFromReq } from '../utils/getEntityFromReq';

type WasmCloudEnvironment = {
  logger: LoggerService;
  config: RootConfigService;
  catalogApi: CatalogApi;
  auth: AuthService;
  httpAuth: HttpAuthService;
};

type WasmCloudBuilderResult = {
  router: Router;
};

export class WasmCloudBuilder {
  private latticeSupplier?: WasmCloudLatticeSupplier;
  private client?: BackstageLatticeClient;

  static create(env: WasmCloudEnvironment): WasmCloudBuilder {
    return new WasmCloudBuilder(env);
  }

  private constructor(private env: WasmCloudEnvironment) {}

  public setLatticeSupplier(latticeSupplier: WasmCloudLatticeSupplier) {
    this.latticeSupplier = latticeSupplier;
  }

  public async build(): Promise<WasmCloudBuilderResult> {
    const { logger } = this.env;
    logger.info('Initializing wasmCloud Backend');

    const latticeSupplier = this.getLatticeSupplier();

    const client = await this.getClient(latticeSupplier);

    const router = await this.buildRouter(client, latticeSupplier);

    return {
      router,
    };
  }

  protected getLatticeSupplier() {
    return this.latticeSupplier ?? this.buildLatticeSupplier();
  }

  protected getClient(latticeSupplier: WasmCloudLatticeSupplier) {
    return this.client ?? this.buildClient(latticeSupplier);
  }

  protected buildLatticeSupplier() {
    const latticeSupplier = ConfigLatticeSupplier.fromConfig(this.env.config);

    return latticeSupplier;
  }

  protected async buildClient(latticeSupplier: WasmCloudLatticeSupplier) {
    const { logger, config } = this.env;

    const client = await BackstageLatticeClient.fromConfig({
      logger,
      config,
      latticeSupplier,
    });

    this.client = client;
    return client;
  }

  protected async buildRouter(
    client: BackstageLatticeClient,
    latticeSupplier: WasmCloudLatticeSupplier,
  ): Promise<Router> {
    const router = Router();
    router.use(express.json());

    router.get('/health', (_, response) => {
      response.json({ status: 'ok' });
    });

    router.get('/lattices', async (_, response) => {
      response.json(await latticeSupplier.getLattices());
    });

    router.get('/lattices/:latticeName/applications', (request, response) => {
      const { latticeName } = request.params;
      response.json(client.lattice(latticeName)?.applications.list());
    });

    router.post('/applications/query', async (request, response) => {
      try {
        const entity = await getEntityFromReq(request, this.env);
        const result = await client.getApplicationsForEntity(entity);

        response.json(result);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown Error';
        this.env.logger.error(message);
        response.status(500).json({ status: 'failed', message });
      }
      return;
    });

    return router;
  }
}
