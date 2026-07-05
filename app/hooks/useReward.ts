import { useEffect, useState } from "react";
import {
  getReward,
  addReward,
  resetReward,
  REWARD_EVENT,
  type RewardState,
} from "@/app/services/reward";

export function useReward() {
  const [reward, setReward] = useState<RewardState>({
    points: 0,
    lastReward: null,
  });

  useEffect(() => {
    function syncReward() {
      setReward(getReward());
    }

    syncReward();
    window.addEventListener(REWARD_EVENT, syncReward);

    return () => {
      window.removeEventListener(REWARD_EVENT, syncReward);
    };
  }, []);

  return {
    reward,
    addReward,
    resetReward,
  };
}