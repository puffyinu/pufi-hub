import { load, save, remove } from "@/app/services/storage";
import type { CheckInState } from "@/app/types/checkin";

const STORAGE_KEY = "pufi-checkin-session";

export const CHECKIN_SESSION_EVENT =
  "pufi-checkin-session-changed";

const DEFAULT_STATE: CheckInState = {
  checkedIn: false,
  lastCheckIn: null,
  loading: false,
  error: null,
};

let session: CheckInState | null = null;

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(CHECKIN_SESSION_EVENT)
    );
  }
}

function ensureState(): CheckInState {
  if (session === null) {
    session =
      load<CheckInState>(STORAGE_KEY) ??
      DEFAULT_STATE;
  }

  return session;
}

export function getCheckInState(): CheckInState {
  return ensureState();
}

export function setCheckInState(
  next: Partial<CheckInState>
): void {
  const current = ensureState();

  session = {
    ...current,
    ...next,
  };

  save(STORAGE_KEY, session);

  notify();
}

export function resetCheckInState(): void {
  session = {
    ...DEFAULT_STATE,
  };

  remove(STORAGE_KEY);

  notify();
}