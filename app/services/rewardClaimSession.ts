import { load, remove, save } from "@/app/services/storage";
import type { RewardClaimState } from "@/app/types/rewardClaim";

const STORAGE_KEY = "pufi-reward-claim-session";

export const REWARD_CLAIM_SESSION_EVENT =
  "pufi-reward-claim-session-changed";

const DEFAULT_STATE: RewardClaimState = {
  status: "idle",
  amount: 0,
  loading: false,
  error: null,
};

let session: RewardClaimState | null = null;

function notify(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(REWARD_CLAIM_SESSION_EVENT)
    );
  }
}

function ensureState(): RewardClaimState {
  if (session === null) {
    session =
      load<RewardClaimState>(STORAGE_KEY) ??
      DEFAULT_STATE;
  }

  return session;
}

export function getRewardClaimState(): RewardClaimState {
  return ensureState();
}

export function setRewardClaimState(
  next: Partial<RewardClaimState>
): void {
  session = {
    ...ensureState(),
    ...next,
  };

  save(STORAGE_KEY, session);

  notify();
}

export function resetRewardClaimState(): void {
  session = {
    ...DEFAULT_STATE,
  };

  remove(STORAGE_KEY);

  notify();
}