import { load, save, remove } from "@/app/services/storage";

export interface RewardState {
  points: number;
  lastReward: string | null;
}

const STORAGE_KEY = "pufi-reward";
export const REWARD_EVENT = "pufi-reward-changed";
const DEFAULT_REWARD: RewardState = {
  points: 0,
  lastReward: null,
};

function notifyRewardChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(REWARD_EVENT));
  }
}

let reward: RewardState | null = null;

function ensureReward(): RewardState {
  if (reward === null) {
    reward = load<RewardState>(STORAGE_KEY) ?? DEFAULT_REWARD;
  }

  return reward;
}

export function getReward(): RewardState {
  return ensureReward();
}

export function addReward(points: number): void {
  const current = ensureReward();
  reward = {
    points: current.points + points,
    lastReward: new Date().toISOString(),
  };

  save(STORAGE_KEY, reward);
  notifyRewardChanged();
}

export function resetReward(): void {
  reward = { ...DEFAULT_REWARD };

  remove(STORAGE_KEY);
  notifyRewardChanged();
}
