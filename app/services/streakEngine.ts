import {
  getStreakState,
  setStreakState,
} from "./streakSession";

import { StreakState } from "@/app/types/streak";

function isYesterday(previous: Date, current: Date): boolean {
  const yesterday = new Date(current);

  yesterday.setDate(current.getDate() - 1);

  return (
    previous.getFullYear() === yesterday.getFullYear() &&
    previous.getMonth() === yesterday.getMonth() &&
    previous.getDate() === yesterday.getDate()
  );
}

export function updateDailyStreak(): StreakState {
  const state = getStreakState();

  const now = new Date();

  if (!state.lastCheckIn) {
    const next: StreakState = {
      currentStreak: 1,
      bestStreak: 1,
      lastCheckIn: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    setStreakState(next);

    return next;
  }

  const last = new Date(state.lastCheckIn);

  let streak = 1;

  if (isYesterday(last, now)) {
    streak = state.currentStreak + 1;
  }

  const next: StreakState = {
    currentStreak: streak,
    bestStreak: Math.max(streak, state.bestStreak),
    lastCheckIn: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  setStreakState(next);

  return next;
}

export function getCurrentStreak(): StreakState {
  return getStreakState();
}