"use client";

import { useEffect, useState } from "react";

import {
  getRewardClaimState,
  resetRewardClaimState,
  REWARD_CLAIM_SESSION_EVENT,
} from "@/app/services/rewardClaimSession";

import {
  prepareRewardClaim,
  executeMockClaim,
} from "@/app/services/rewardClaimEngine";

import type { RewardClaimState } from "@/app/types/rewardClaim";

export function useRewardClaim() {
  const [rewardClaim, setRewardClaim] =
    useState<RewardClaimState>(() =>
      getRewardClaimState()
    );

  useEffect(() => {
    const sync = () => {
      setRewardClaim(getRewardClaimState());
    };

    sync();

    window.addEventListener(
      REWARD_CLAIM_SESSION_EVENT,
      sync
    );

    return () => {
      window.removeEventListener(
        REWARD_CLAIM_SESSION_EVENT,
        sync
      );
    };
  }, []);

  const prepare = (token: string, amount: number) => {
    prepareRewardClaim(token, amount);
  };

  const executeMock = async (token: string, amount: number) => {
    return await executeMockClaim(token, amount);
  };

  const reset = () => {
    resetRewardClaimState();
  };

  return {
    rewardClaim,
    prepare,
    executeMock,
    reset,
  };
}