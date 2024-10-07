import React from 'react';
import { WasmCloudOverviewCard } from './WasmCloudOverviewCard';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import {
  registerMswTestHooks,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import {
  WasmCloudApi,
  wasmcloudApiRef,
} from '@cosmonic/backstage-plugin-wasmcloud-react';
import { AnyApiRef } from '@backstage/core-plugin-api';
import { entityMock } from '../mocks/entity';

const apis: [AnyApiRef, Partial<unknown>][] = [
  [
    wasmcloudApiRef,
    {
      getApplications() {
        return Promise.resolve([]);
      },
    } satisfies WasmCloudApi,
  ],
];

describe('WasmCloudOverviewCard', () => {
  const server = setupServer();
  registerMswTestHooks(server);

  beforeEach(() => {
    server.use(
      rest.get('/*', (_, res, ctx) => res(ctx.status(200), ctx.json({}))),
    );
  });

  it('should render', async () => {
    await renderInTestApp(
      <TestApiProvider apis={apis}>
        <EntityProvider entity={entityMock}>
          <WasmCloudOverviewCard />
        </EntityProvider>
      </TestApiProvider>,
    );
    expect(screen.getByText('wasmCloud Overview')).toBeInTheDocument();
  });
});
