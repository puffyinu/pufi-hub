import { load, remove, save } from "@/app/services/storage";
import {
  DEFAULT_RUNTIME_STATE,
  type RuntimeState,
} from "@/app/types/runtime";

const STORAGE_KEY = "pufi-runtime-session";

export const RUNTIME_SESSION_EVENT =
  "pufi-runtime-session-changed";

let runtimeState: RuntimeState =
  load<RuntimeState>(STORAGE_KEY) ??
  DEFAULT_RUNTIME_STATE;

function notifyRuntimeChanged(): void {
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
  nextState: Partial<RuntimeState>
): void {
  runtimeState = {
    ...runtimeState,
    ...nextState,
  };

  save(STORAGE_KEY, runtimeState);

  notifyRuntimeChanged();
}

export function resetRuntimeState(): void {
  runtimeState = {
    ...DEFAULT_RUNTIME_STATE,
  };

  remove(STORAGE_KEY);

  notifyRuntimeChanged();
}