export interface ProviderStatus {
  ready: boolean;
  source: string;
}

export interface DataProvider {
  initialize(): Promise<void>;

  isReady(): boolean;

  getStatus(): ProviderStatus;
}