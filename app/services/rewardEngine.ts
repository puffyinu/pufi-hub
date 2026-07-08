import { getRewardState } from "@/app/services/rewardSession";

export function getAvailableReward(): number {
  return getRewardState().available;
}

export function getPendingReward(): number {
  return getRewardState().pending;
}

export function getClaimedReward(): number {
  return getRewardState().claimed;
}

export function hasRewardAvailable(): boolean {
  return getAvailableReward() > 0;
}