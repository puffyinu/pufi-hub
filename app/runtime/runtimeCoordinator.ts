import {
  resetRuntimeState,
  setRuntimeState,
} from "@/app/services/runtimeSession";

import { isMiniKitReady } from "@/app/runtime/minikitManager";

class RuntimeCoordinator {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    setRuntimeState({
      initialized: true,
      miniKitReady: isMiniKitReady(),
      lastSync: new Date().toISOString(),
    });
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  reset(): void {
    this.initialized = false;

    resetRuntimeState();
  }
}

export const runtimeCoordinator =
  new RuntimeCoordinator();