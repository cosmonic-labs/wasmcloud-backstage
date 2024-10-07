import React from 'react';
import { WasmCloudDetailsPage } from './WasmCloudDetailsPage';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import {
  registerMswTestHooks,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { AnyApiRef } from '@backstage/core-plugin-api';
import {
  wasmcloudApiRef,
  WasmCloudApi,
} from '@cosmonic/backstage-plugin-wasmcloud-react';
import { EntityProvider } from '@backstage/plugin-catalog-react';
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

describe('WasmCloudDetailsPage', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  registerMswTestHooks(server);

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get('/*', (_, res, ctx) => res(ctx.status(200), ctx.json({}))),
    );
  });

  it('should render', async () => {
    await renderInTestApp(
      <TestApiProvider apis={apis}>
        <EntityProvider entity={entityMock}>
          <WasmCloudDetailsPage />
        </EntityProvider>
      </TestApiProvider>,
    );
    expect(screen.getByText('wasmCloud Applications')).toBeInTheDocument();
  });
});
