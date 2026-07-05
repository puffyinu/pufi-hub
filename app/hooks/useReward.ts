import { useMemo } from "react";
import {
  getReward,
  addReward,
  resetReward,
} from "@/app/services/reward";

export function useReward() {
  return useMemo(() => {
    return {
      reward: getReward(),
      addReward,
      resetReward,
    };
  }, []);
}
