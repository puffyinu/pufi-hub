import { load, remove, save } from "@/app/services/storage";
import type { RewardClaimQueueState, PendingReward, RewardClaimStatus } from "@/app/types/rewardClaim";

const STORAGE_KEY = "pufi-reward-claim-queue";

export const REWARD_CLAIM_SESSION_EVENT =
  "pufi-reward-claim-queue-changed";

const DEFAULT_STATE: RewardClaimQueueState = {
  rewards: [],
};

let session: RewardClaimQueueState | null = null;

function notify(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(REWARD_CLAIM_SESSION_EVENT)
    );
  }
}

function ensureState(): RewardClaimQueueState {
  if (session === null) {
    session =
      load<RewardClaimQueueState>(STORAGE_KEY) ??
      DEFAULT_STATE;
  }

  return session;
}

export function getPendingRewards(): PendingReward[] {
  return ensureState().rewards;
}

export function addRewardToQueue(reward: PendingReward): void {
  const state = ensureState();
  session = {
    rewards: [...state.rewards, reward],
  };

  save(STORAGE_KEY, session);
  notify();
}

export function updateRewardStatus(id: string, status: RewardClaimStatus): void {
  const state = ensureState();
  session = {
    rewards: state.rewards.map(r => r.id === id ? { ...r, status } : r),
  };

  save(STORAGE_KEY, session);
  notify();
}

export function resetRewardQueue(): void {
  session = {
    ...DEFAULT_STATE,
  };

  remove(STORAGE_KEY);
  notify();
}
