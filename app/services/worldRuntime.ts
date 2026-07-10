import { isMiniKitReady } from "@/app/runtime/minikitManager";

export interface WorldRuntimeStatus {
  miniKitReady: boolean;
  initializedAt: string | null;
}

let initializedAt: string | null = null;

export function initializeWorldRuntime(): WorldRuntimeStatus {
  if (!initializedAt) {
    initializedAt = new Date().toISOString();
  }

  return {
    miniKitReady: isMiniKitReady(),
    initializedAt,
  };
}

export function getWorldRuntimeStatus(): WorldRuntimeStatus {
  return {
    miniKitReady: isMiniKitReady(),
    initializedAt,
  };
}

export function resetWorldRuntime(): void {
  initializedAt = null;
}