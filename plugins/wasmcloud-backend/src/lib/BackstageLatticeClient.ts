// TODO: remove once using @nats-io/transport-node (see below)
import w3c from 'websocket';
// @ts-expect-error -- nats.ws expects a global WebSocket
// https://github.com/nats-io/nats.js/blob/61cb880def0451a46e718f95636d5847a7894e28/core/src/ws_transport.ts#L57-L58
globalThis.WebSocket = w3c.w3cwebsocket;

import {
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import {
  ApplicationSummary,
  LatticeClient,
  NatsWsLatticeConnection,
} from '@wasmcloud/lattice-client-core';
import { WasmCloudLatticeDetails, WasmCloudLatticeSupplier } from '../types';
import { Entity } from '@backstage/catalog-model';
import { WASMCLOUD_ANNOTATION } from '@cosmonic/backstage-plugin-wasmcloud-common';

export class BackstageLatticeClient {
  static async fromConfig({
    logger,
    latticeSupplier,
  }: {
    config: RootConfigService;
    logger: LoggerService;
    latticeSupplier: WasmCloudLatticeSupplier;
  }) {
    const lattices = await latticeSupplier.getLattices();
    return new BackstageLatticeClient(logger, lattices);
  }

  private latticeClients = new Map<string, LatticeClient>();

  private constructor(
    private readonly logger: LoggerService,
    private readonly lattices: WasmCloudLatticeDetails[],
  ) {
    for (const lattice of this.lattices) {
      const isWebsocket = lattice.latticeUrl.startsWith('ws');
      const getNewConnection = () => {
        // TODO: implement LatticeConnection using @nats-io/transport-node instead of WebSockets
        if (!isWebsocket)
          throw new Error(
            'Unsupported protocol. Configure lattice using WebSocket',
          );
        return new NatsWsLatticeConnection(lattice);
      };
      try {
        const client = new LatticeClient({
          config: lattice,
          getNewConnection,
          autoConnect: true,
        });
        this.latticeClients.set(lattice.name, client);
      } catch (e: unknown) {
        this.logger.error(e instanceof Error ? e.message : 'Unknown Error');
      }
    }
    this.logger.info(`Found ${this.lattices.length} lattice definition`);
  }

  lattice(name: string) {
    return this.latticeClients.get(name);
  }

  async getApplicationsForEntity(entity: Entity) {
    this.logger.info(
      `Getting Applications for entity with id "${
        entity?.metadata?.name ?? 'unknown'
      }"`,
    );

    async function getList(client: LatticeClient) {
      const res = await client.applications.list();
      if (res.result === 'error') throw new Error(res.message);

      return res.models;
    }

    async function getDetail(
      lattice: string,
      client: LatticeClient,
      summary: ApplicationSummary,
    ) {
      const res = await client.applications.detail(summary.name);

      return {
        lattice,
        summary,
        ...res.detail,
      };
    }

    async function getExpandedList(
      lattice: string,
      client: LatticeClient,
      list: ApplicationSummary[],
    ) {
      const expandedList = await Promise.all(
        list.map(summary => getDetail(lattice, client, summary)),
      );

      const filteredList = expandedList.filter(app => {
        const { annotations } = app.manifest.metadata;
        return (
          WASMCLOUD_ANNOTATION in annotations &&
          annotations[WASMCLOUD_ANNOTATION] === entity.metadata.name
        );
      });

      return filteredList;
    }

    async function getAllApplications(
      latticeClients: [string, LatticeClient][],
    ) {
      const nestedApplications = await Promise.all(
        latticeClients.map(async ([lattice, client]) => {
          const list = await getList(client);
          return Promise.all(await getExpandedList(lattice, client, list));
        }),
      );

      return nestedApplications.flatMap(app => app);
    }

    return getAllApplications(Array.from(this.latticeClients.entries()));
  }
}
