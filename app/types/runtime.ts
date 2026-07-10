export interface RuntimeState {
  initialized: boolean;
  miniKitReady: boolean;
  lastSync: string | null;
}

export const DEFAULT_RUNTIME_STATE: RuntimeState = {
  initialized: false,
  miniKitReady: false,
  lastSync: null,
};