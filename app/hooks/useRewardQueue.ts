"use client";

import { useEffect, useState } from "react";
import {
  REWARD_CLAIM_SESSION_EVENT,
} from "@/app/services/rewardClaimSession";
import { getRewardQueue as getEngineRewardQueue } from "@/app/services/rewardClaimEngine";
import type { PendingReward } from "@/app/types/rewardClaim";

export function useRewardQueue() {
  const [rewards, setRewards] = useState<PendingReward[]>(() => getEngineRewardQueue());

  useEffect(() => {
    const sync = () => {
      setRewards(getEngineRewardQueue());
    };

    sync();

    window.addEventListener(REWARD_CLAIM_SESSION_EVENT, sync);

    return () => {
      window.removeEventListener(REWARD_CLAIM_SESSION_EVENT, sync);
    };
  }, []);

  return {
    rewards,
  };
}
