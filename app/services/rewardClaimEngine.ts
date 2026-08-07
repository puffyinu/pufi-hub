import {
  getRewardClaimState,
  setRewardClaimState,
} from "@/app/services/rewardClaimSession";

import { getRewardState, setRewardState } from "@/app/services/rewardSession";

export function canClaimReward(token?: string): boolean {
  const state = getRewardState();
  if (token) {
    return (state.pendingByToken[token] || 0) > 0;
  }
  return state.available > 0;
}

export function prepareRewardClaim(token: string, amount: number): boolean {
  if (!canClaimReward(token)) {
    setRewardClaimState({
      status: "failed",
      token,
      amount: 0,
      error: "No reward available for this token.",
    });

    return false;
  }

  setRewardClaimState({
    status: "ready",
    token,
    amount,
    loading: false,
    error: null,
  });

  return true;
}

export async function executeMockClaim(token: string, amount: number): Promise<boolean> {
  const claimState = getRewardClaimState();
  if (claimState.status !== "ready" || claimState.token !== token) {
    return false;
  }

  setRewardClaimState({
    status: "claiming",
    loading: true,
  });

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const rewardState = getRewardState();
  
  // Update Reward State
  const pendingByToken = { ...rewardState.pendingByToken };
  const claimedByToken = { ...rewardState.claimedByToken };

  pendingByToken[token] = Math.max(0, (pendingByToken[token] || 0) - amount);
  claimedByToken[token] = (claimedByToken[token] || 0) + amount;

  const totalPending = Object.values(pendingByToken).reduce((a, b) => a + b, 0);
  const totalClaimed = Object.values(claimedByToken).reduce((a, b) => a + b, 0);

  setRewardState({
    pending: totalPending,
    available: totalPending, // Syncing available with pending for now
    claimed: totalClaimed,
    pendingByToken,
    claimedByToken,
  });

  setRewardClaimState({
    status: "claimed",
    loading: false,
    txHash: `0xmock${Math.random().toString(16).slice(2, 10)}`,
  });

  return true;
}

export function getCurrentRewardClaim() {
  return getRewardClaimState();
}