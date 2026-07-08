import { DEFAULT_STREAK_STATE, StreakState } from "@/app/types/streak";

const STORAGE_KEY = "pufi-streak";

export const STREAK_EVENT = "STREAK_EVENT";

export function getStreakState(): StreakState {
  if (typeof window === "undefined") {
    return DEFAULT_STREAK_STATE;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return DEFAULT_STREAK_STATE;
    }

    return JSON.parse(raw) as StreakState;
  } catch {
    return DEFAULT_STREAK_STATE;
  }
}

export function setStreakState(state: StreakState): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  window.dispatchEvent(new Event(STREAK_EVENT));
}

export function resetStreakState(): void {
  setStreakState(DEFAULT_STREAK_STATE);
}