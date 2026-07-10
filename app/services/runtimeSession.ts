import {
  DEFAULT_RUNTIME_STATE,
  type RuntimeState,
} from "@/app/types/runtime";

import {
  load,
  remove,
  save,
} from "@/app/services/storage";

import { getWorldRuntimeStatus } from "@/app/services/worldRuntime";

const STORAGE_KEY = "pufi-runtime-session";

export const RUNTIME_SESSION_EVENT =
  "pufi-runtime-session-changed";

let runtimeState =
  load<RuntimeState>(STORAGE_KEY) ??
  DEFAULT_RUNTIME_STATE;

function notify(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(RUNTIME_SESSION_EVENT)
    );
  }
}

export function getRuntimeState(): RuntimeState {
  return runtimeState;
}

export function setRuntimeState(
  next: Partial<RuntimeState>
): void {
  runtimeState = {
    ...runtimeState,
    ...next,
  };

  save(STORAGE_KEY, runtimeState);

  notify();
}

export function refreshRuntimeState(): RuntimeState {
  const world =
    getWorldRuntimeStatus();

  runtimeState = {
    ...runtimeState,
    miniKitReady: world.miniKitReady,
    lastSync: world.initializedAt,
  };

  save(STORAGE_KEY, runtimeState);

  notify();

  return runtimeState;
}

export function resetRuntimeState(): void {
  runtimeState = {
    ...DEFAULT_RUNTIME_STATE,
  };

  remove(STORAGE_KEY);

  notify();
}