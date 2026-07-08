"use client";

import { useEffect, useState } from "react";

import {
  getRewardClaimState,
  resetRewardClaimState,
  REWARD_CLAIM_SESSION_EVENT,
} from "@/app/services/rewardClaimSession";

import {
  prepareRewardClaim,
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

  const claim = () => {
    prepareRewardClaim();

    setRewardClaim(getRewardClaimState());
  };

  const reset = () => {
    resetRewardClaimState();

    setRewardClaim(getRewardClaimState());
  };

  return {
    rewardClaim,
    claim,
    reset,
  };
}