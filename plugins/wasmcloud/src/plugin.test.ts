import { wasmcloudPlugin } from './plugin';

describe('wasmcloud', () => {
  it('should export plugin', () => {
    expect(wasmcloudPlugin).toBeDefined();
  });
});
