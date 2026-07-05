import { load, save, remove } from "@/app/services/storage";

export interface RewardState {
  points: number;
  lastReward: string | null;
}

const STORAGE_KEY = "pufi-reward";

let reward: RewardState =
  load<RewardState>(STORAGE_KEY) ?? {
    points: 0,
    lastReward: null,
  };

export function getReward(): RewardState {
  return reward;
}

export function addReward(points: number): void {
  reward = {
    points: reward.points + points,
    lastReward: new Date().toISOString(),
  };

  save(STORAGE_KEY, reward);
}

export function resetReward(): void {
  reward = {
    points: 0,
    lastReward: null,
  };

  remove(STORAGE_KEY);
}
