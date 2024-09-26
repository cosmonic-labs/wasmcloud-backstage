# wasmCloud Backstage Plugin

This repository contains the source code for the [Backstage](https://backstage.io/) plugin for [wasmCloud](https://wasmcloud.com). The plugin provides a set of Frontend components and Backend APIs to interact with your wasmCloud lattices. You can use this plugin to associate wasmCloud applications to entities in Backstage, enabling better visibility, documentation and management across your tech stack.

- **Primary Plugins**:

  - [@cosmonic/backstage-plugin-wasmcloud](./plugins/wasmcloud)
    This contains the main components for adding overviews of your applications to backstage
  - [@cosmonic/backstage-plugin-wasmcloud-backend](./plugins/wasmcloud-backend)
    The plugin backend for interacting with wasmCloud lattices. This works in tandem with the backstage frontend plugin.

- **Internal Plugins**:

  - [@cosmonic/backstage-plugin-wasmcloud-common](./plugins/wasmcloud-common)
    Common utilities for both the backend and frontend to share code between them. You should not need to use this directly in your project.
  - [@cosmonic/backstage-plugin-wasmcloud-react](./plugins/wasmcloud-react)
    Common React components used across multiple parts of the frontend plugin. You should not need to use this directly in your project.

## Getting Started

To get started with the wasmCloud Backstage plugin, follow these steps:

### 1. Install the frontend and backend plugins

To add the wasmCloud plugin to your project, you will need both the frontend and the backend plugins:

```text
yarn workspace app add @cosmonic/backstage-plugin-wasmcloud
yarn workspace backend add @cosmonic/backstage-plugin-wasmcloud-backend
```

### 2. Configure your lattice connection/s

Add the following section to your `app-config.yaml`. Note that these are the default settings for a lattice that has been started with a WebSocket connection. If you have a different configuration for your NATS lattice, you should change these settings.

```yaml:
wasmcloud:
  lattices:
    - name: "default"
      connection: "nats-ws"
      latticeUrl: "ws://127.0.0.1:4223"
```

### 3. Configure the Frontend Components as you like

#### Overview Card

The Overview Card (exported as `EntityWasmCloudOverviewCard`) will give a status overview for any applications that match the entity wasmcloud annotation. (e.g. `backstage.io/wasmcloud-id: your-entity-id`)

```tsx
// packages/app/src/components/catalog/EntityPage.tsx
import {
  isWasmCloudAvailable,
  EntityWasmCloudOverviewCard,
} from '@cosmonic/backstage-plugin-wasmcloud';

const overviewContent = (
  <Grid container spacing={3} alignItems="stretch">
    ...
    <EntitySwitch>
      <EntitySwitch.Case if={isWasmCloudAvailable}>
        <Grid item>
          <EntityWasmCloudOverviewCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
    ...
  </Grid>
);
```

#### Details Page

The Details Page (exported as `EntityWasmCloudDetailsPage`) is an expanded view of an application which can give more insight such as the source manifest yaml, the application components and providers, as well as the hosts that are currently hosting the application. The example below adds the `/wasmcloud` route to the `serviceEntityPage` layout, but feel free to include it in any other entity page you have configured.

```tsx
// packages/app/src/components/catalog/EntityPage.tsx
import {
  isWasmCloudAvailable,
  EntityWasmCloudDetailsPage,
} from '@cosmonic/backstage-plugin-wasmcloud';

const serviceEntityPage = (
  <EntitySwitch>
    <EntityLayout.Route
      path="/wasmcloud"
      title="wasmCloud"
      if={isWasmCloudAvailable}
    >
      <EntityWasmCloudDetailsPage />
    </EntityLayout.Route>
  </EntitySwitch>
);
```

### 4. Configure your entity and your application with the correct annotation

If you would like the annotation to show up on the entity page, you should add the `backstage.io/wasmcloud-id` annotation to both the catalog entity as well as the wadm application:

```yaml
# entity.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-app # this does not need to match
  annotations:
    backstage.io/wasmcloud-id: <your-app-name>
spec:
  # ...
```

```yaml
# applicaion.wadm.yaml
apiVersion: core.oam.dev/v1beta1
kind: Application
metadata:
  name: my-app-deployment # this does not need to match
  annotations:
    backstage.io/wasmcloud-id: <your-app-name>
spec:
  # ...
```

## Contributing

The example app does not start a wasmCloud Lattice or deploy any wadm applications. For instructions on how to get up and running, check out the [wasmCloud Quickstart](https://wasmcloud.com/docs/tour/hello-world). There is an [example app manifest](./examples/wasmcloud-applications/rust-hello-world.wadm.yaml) included in the examples folder which you can deploy to get up and running the fastest.

To start the example app which will allow you to test both plugins:

```sh
yarn install
yarn dev
```

To run an individual plugin:

```sh
cd plugins/backstage-plugin-<name>
yarn install
yarn start
```

Note that while running each plugin individually may be faster, the backend and frontend plugins are made to work together and running one without the other is not supported.
