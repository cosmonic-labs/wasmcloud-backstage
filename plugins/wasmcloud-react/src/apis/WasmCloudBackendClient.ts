import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { WasmCloudApi } from './WasmCloudApi';

type WasmCloudRequestArgs = {
  entity: Entity;
};

export class WasmCloudBackendClient implements WasmCloudApi {
  constructor(
    private readonly discoveryApi: DiscoveryApi,
    private readonly fetchApi: FetchApi,
  ) {}

  private async fetch(url: string | URL | Request, init: RequestInit = {}) {
    const { headers, ...rest } = init;
    return await this.fetchApi.fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...rest,
    });
  }

  private async post(url: string, body: Record<string, any>) {
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`${response.statusText}: ${text}`);
    }

    return response.json();
  }

  private async getUrl(path?: `/${string}`) {
    const baseUrl = await this.discoveryApi.getBaseUrl('wasmcloud');
    if (!path) return baseUrl;
    return `${baseUrl}${path}`;
  }

  async getApplications({ entity }: WasmCloudRequestArgs) {
    const url = await this.getUrl(`/applications/query`);
    const entityRef = stringifyEntityRef(entity);
    return await this.post(url, { entityRef }).then(this.handleResponse);
  }
}
