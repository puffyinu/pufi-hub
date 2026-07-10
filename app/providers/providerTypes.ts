export interface ProviderStatus {
  ready: boolean;
  source: string;
}

export interface DataProvider {
  initialize(): Promise<void>;

  isReady(): boolean;

  getStatus(): ProviderStatus;

  load<T>(
    key: string
  ): T | null;

  save<T>(
    key: string,
    value: T
  ): void;

  remove(
    key: string
  ): void;
}