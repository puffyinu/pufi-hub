import { LocalProvider } from "./localProvider";

import type {
  DataProvider,
} from "./providerTypes";

let provider: DataProvider =
  new LocalProvider();

export async function
initializeProvider(): Promise<void> {
  await provider.initialize();
}

export function
registerProvider(
  next: DataProvider
): void {
  provider = next;
}

export function
getProvider(): DataProvider {
  return provider;
}