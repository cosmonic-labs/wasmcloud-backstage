import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { wasmcloudPlugin } from '../src/plugin';
import { WasmCloudPage } from '../src';

createDevApp()
  .registerPlugin(wasmcloudPlugin)
  .addPage({
    element: <WasmCloudPage />,
    title: 'Root Page',
    path: '/wasmcloud',
  })
  .render();
