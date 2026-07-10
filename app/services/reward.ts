import { provider } from "@/app/providers/providerAccess";

export interface RewardState {
  points: number;
  lastReward: string | null;
}

const STORAGE_KEY = "pufi-reward";

export const REWARD_EVENT =
  "pufi-reward-changed";

const DEFAULT_REWARD: RewardState = {
  points: 0,
  lastReward: null,
};

let reward: RewardState | null = null;

function storage() {
  return provider();
}

function notifyRewardChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(REWARD_EVENT)
    );
  }
}

function ensureReward(): RewardState {
  if (reward === null) {
    reward =
      storage().load<RewardState>(
        STORAGE_KEY
      ) ?? DEFAULT_REWARD;
  }

  return reward;
}

export function getReward(): RewardState {
  return ensureReward();
}

export function addReward(
  points: number
): void {
  const current = ensureReward();

  reward = {
    points: current.points + points,
    lastReward: new Date().toISOString(),
  };

  storage().save(STORAGE_KEY, reward);

  notifyRewardChanged();
}

export function resetReward(): void {
  reward = {
    ...DEFAULT_REWARD,
  };

  storage().remove(STORAGE_KEY);

  notifyRewardChanged();
}