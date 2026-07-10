import {
  getCheckInState,
  setCheckInState,
} from "@/app/services/checkinSession";

import { getRewardState } from "@/app/services/rewardSession";
import { setRewardState } from "@/app/services/rewardSession";
import { createRewardEvent } from "@/app/services/rewardEvent";

const DAILY_CHECKIN_REWARD = 10;

function startOfDay(date: Date): number {
  const value = new Date(date);

  value.setHours(0, 0, 0, 0);

  return value.getTime();
}

export function isSameDay(
  first: Date,
  second: Date
): boolean {
  return startOfDay(first) === startOfDay(second);
}

export function hasCheckedInToday(): boolean {
  const state = getCheckInState();

  if (!state.checkedIn || !state.lastCheckIn) {
    return false;
  }

  return isSameDay(
    new Date(state.lastCheckIn),
    new Date()
  );
}

export function canCheckInToday(): boolean {
  return !hasCheckedInToday();
}

export function performDailyCheckIn(): boolean {
  if (!canCheckInToday()) {
    return false;
  }

  createRewardEvent(
    "daily_checkin",
    DAILY_CHECKIN_REWARD
  );

  const reward = getRewardState();

  setRewardState({
    available:
      reward.available + DAILY_CHECKIN_REWARD,
  });

  setCheckInState({
    checkedIn: true,
    lastCheckIn: new Date().toISOString(),
    loading: false,
    error: null,
  });

  return true;
}

export function getLastCheckInDate(): Date | null {
  const state = getCheckInState();

  if (!state.lastCheckIn) {
    return null;
  }

  return new Date(state.lastCheckIn);
}