import { useEffect, useState } from "react";
import {
  getReward,
  addReward,
  resetReward,
  REWARD_EVENT,
} from "@/app/services/reward";

export function useReward() {
  const [reward, setReward] = useState(getReward());

  useEffect(() => {
    function syncReward() {
      setReward(getReward());
    }

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
