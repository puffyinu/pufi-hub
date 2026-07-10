"use client";

import { useEffect, useState } from "react";

import {
  STREAK_EVENT,
  getStreakState,
} from "@/app/services/streakSession";

import {
  getCurrentStreak,
  updateDailyStreak,
} from "@/app/services/streakEngine";

import { StreakState } from "@/app/types/streak";

export function useStreak() {
  const [streak, setStreak] = useState<StreakState>(getStreakState());

  useEffect(() => {
    const sync = () => {
      setStreak(getCurrentStreak());
    };

    window.addEventListener(STREAK_EVENT, sync);

    sync();

    return () => {
      window.removeEventListener(STREAK_EVENT, sync);
    };
  }, []);

  const refresh = () => {
    setStreak(getCurrentStreak());
  };

  const update = () => {
    const next = updateDailyStreak();
    setStreak(next);

    return next;
  };

  return {
    streak,
    refresh,
    update,
  };
}