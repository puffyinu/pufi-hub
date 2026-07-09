import type { DataProvider } from "./providerTypes";

let provider: DataProvider | null = null;

export function registerProvider(next: DataProvider) {
  provider = next;
}

export function getProvider(): DataProvider {
  if (!provider) {
    throw new Error("No data provider registered.");
  }

  return provider;
}