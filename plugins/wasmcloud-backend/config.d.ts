export interface Config {
  wasmcloud?: {
    lattices: Array<{
      name: string;
      latticeUrl: string;
      connection: 'nats-ws' | 'custom';
      title?: string;
      latticeName?: string;
      ctlTopicPrefix?: string;
      wadmTopicPrefix?: string;
      creds?: string;
    }>;
  };
}
