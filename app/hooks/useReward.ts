"use client";

import { useEffect, useState } from "react";

import {
  getRewardState,
  resetRewardState,
  setRewardState,
  REWARD_SESSION_EVENT,
} from "@/app/services/rewardSession";

import type { RewardState } from "@/app/types/reward";

export function useReward() {
  const [reward, setReward] =
    useState<RewardState>(() =>
      getRewardState()
    );

  useEffect(() => {
    const sync = () => {
      setReward(getRewardState());
    };

    sync();

    window.addEventListener(
      REWARD_SESSION_EVENT,
      sync
    );

    return () => {
      window.removeEventListener(
        REWARD_SESSION_EVENT,
        sync
      );
    };
  }, []);

  const setAvailable = (amount: number) => {
    setRewardState({
      available: amount,
    });
  };

  const reset = () => {
    resetRewardState();
  };

  return {
    reward,
    setAvailable,
    reset,
  };
}