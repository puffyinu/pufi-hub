import {
  resetRuntimeState,
  setRuntimeState,
} from "@/app/services/runtimeSession";

import {
  initializeWorldRuntime,
  resetWorldRuntime,
} from "@/app/services/worldRuntime";

class RuntimeCoordinator {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    const runtime = initializeWorldRuntime();

    setRuntimeState({
      initialized: true,
      miniKitReady: runtime.miniKitReady,
      lastSync: runtime.initializedAt,
    });
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  reset(): void {
    this.initialized = false;

    resetWorldRuntime();

    resetRuntimeState();
  }
}

export const runtimeCoordinator =
  new RuntimeCoordinator();