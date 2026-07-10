import {
  setRuntimeState,
  resetRuntimeState,
} from "@/app/services/runtimeSession";

class RuntimeCoordinator {
  private initialized = false;

  async initialize(): Promise<void> {
  if (this.initialized) {
    return;
  }

  this.initialized = true;

  setRuntimeState({
    initialized: true,
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

export const runtimeCoordinator = new RuntimeCoordinator();