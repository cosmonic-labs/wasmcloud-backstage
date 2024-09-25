import { RootConfigService } from '@backstage/backend-plugin-api';
import { WasmCloudLatticeDetails, WasmCloudLatticeSupplier } from '../types';

export class ConfigLatticeSupplier implements WasmCloudLatticeSupplier {
  #lattices: WasmCloudLatticeDetails[];

  static fromConfig(config: RootConfigService): WasmCloudLatticeSupplier {
    const latticeNames = new Set<string>();
    const lattices = config.getConfigArray('lattices').map(latticeConfig => {
      const name = latticeConfig.getString('name');

      if (latticeNames.has(name))
        throw new Error(`Duplicate lattice name '${name}'`);

      /**
       * Get optional config from latticeConfig and return it inside an object. We do this because
       * the default values will be reapplied and overridden if the passed object includes the key,
       * even if the the value is `undefined`.
       *
       * @param key the key to get from latticeConfig
       * @returns either an empty object, or an object with a single string key-value pair
       */
      function getOptionalConfig<K extends string>(
        key: K,
      ): {} | { [P in K]: string } {
        const value = latticeConfig.getOptionalString(key);
        if (!value) return {};
        return { [key]: value };
      }

      return {
        // required values
        name,
        latticeUrl: latticeConfig.getString('latticeUrl'),
        // TODO(lachieh): add extension point so connection can be replaced with custom implementation
        connection: latticeConfig.getString('connection') as 'nats-ws',

        // optional entries
        ...getOptionalConfig('title'),
        ...getOptionalConfig('latticeName'),
        ...getOptionalConfig('ctlTopicPrefix'),
        ...getOptionalConfig('wadmTopicPrefix'),
        ...getOptionalConfig('creds'),
      } satisfies WasmCloudLatticeDetails;
    });

    return new ConfigLatticeSupplier(lattices);
  }

  constructor(lattices: WasmCloudLatticeDetails[]) {
    this.#lattices = lattices;
  }

  async getLattices(): Promise<WasmCloudLatticeDetails[]> {
    return this.#lattices;
  }
}
