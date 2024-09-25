/**
 * Used to load a collection of lattices from different sources
 */
export interface WasmCloudLatticeSupplier {
  getLattices(): Promise<WasmCloudLatticeDetails[]>;
}

/**
 * The details of a lattice, provided by a WasmCloudLatticeSupplier, so that a
 * client can connect to it.
 * @public
 */
export interface WasmCloudLatticeDetails {
  /** Name of the Kubernetes cluster; used as an internal identifier. */
  name: string;
  /** Connection URL for lattice, including protocol and port */
  latticeUrl: string;
  /**
   * Connection Type used to make requests over the lattice. If you are
   * implementing your own lattice connection, use 'custom'
   */
  connection: 'nats-ws' | 'custom';
  /** Human-readable name for the lattice, to be displayed in UIs. */
  title?: string;
  /**
   * Lattice Name - used for nats cluster isolation
   * @default "default"
   * @see https://wasmcloud.com/docs/hosts/lattice-protocols/name
   */
  latticeName?: string;
  /**
   * prefix to use for all CTL topics
   * @default undefined
   * @see https://wasmcloud.com/docs/reference/host-config
   */
  ctlTopicPrefix?: string;
  /**
   * API topic prefix to use
   * @default "wadm"
   * @see https://wasmcloud.com/docs/deployment/wadm/configuration
   */
  wadmTopicPrefix?: string;
  /**
   * creds file contents as a string
   * @see https://wasmcloud.com/docs/deployment/security/nats-segmentation
   */
  creds?: string;
}
