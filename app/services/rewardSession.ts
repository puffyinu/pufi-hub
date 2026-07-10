import { load, remove, save } from "@/app/services/storage";
import type { RewardState } from "@/app/types/reward";

const STORAGE_KEY = "pufi-reward-session";

export const REWARD_SESSION_EVENT =
  "pufi-reward-session-changed";

const DEFAULT_STATE: RewardState = {
  available: 0,
  claimed: 0,
  pending: 0,
  loading: false,
  error: null,
};

let session: RewardState | null = null;

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(REWARD_SESSION_EVENT)
    );
  }
}

function ensureState(): RewardState {
  if (session === null) {
    session =
      load<RewardState>(STORAGE_KEY) ??
      DEFAULT_STATE;
  }

  return session;
}

export function getRewardState(): RewardState {
  return ensureState();
}

export function setRewardState(
  next: Partial<RewardState>
): void {
  session = {
    ...ensureState(),
    ...next,
  };

  save(STORAGE_KEY, session);

  notify();
}

export function resetRewardState(): void {
  session = {
    ...DEFAULT_STATE,
  };

  remove(STORAGE_KEY);

  notify();
}