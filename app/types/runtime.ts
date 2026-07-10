export interface RuntimeState {
  initialized: boolean;
  lastSync: string | null;
}

export const DEFAULT_RUNTIME_STATE: RuntimeState = {
  initialized: false,
  lastSync: null,
};