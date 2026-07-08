import {
  getRewardClaimState,
  setRewardClaimState,
} from "@/app/services/rewardClaimSession";

import { getRewardState } from "@/app/services/rewardSession";

export function canClaimReward(): boolean {
  return getRewardState().available > 0;
}

export function prepareRewardClaim(): boolean {
  if (!canClaimReward()) {
    setRewardClaimState({
      status: "failed",
      error: "No reward available.",
    });

    return false;
  }

  setRewardClaimState({
    status: "ready",
    amount: getRewardState().available,
    loading: false,
    error: null,
  });

  return true;
}

export function getCurrentRewardClaim() {
  return getRewardClaimState();
}