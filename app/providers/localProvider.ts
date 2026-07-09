import type {
  DataProvider,
  ProviderStatus,
} from "./providerTypes";

export class LocalProvider implements DataProvider {
  private ready = false;

  async initialize(): Promise<void> {
    this.ready = true;
  }

  isReady(): boolean {
    return this.ready;
  }

  getStatus(): ProviderStatus {
    return {
      ready: this.ready,
      source: "local-storage",
    };
  }
}