import { load, save, remove } from "@/app/services/storage";
import { addReward } from "@/app/services/reward";
import { updateDailyStreak } from "@/app/services/streakEngine";
import { recordCheckInActivity } from "@/app/services/activityEngine";
import { unlockAchievement } from "@/app/services/achievementEngine";

export interface CheckInStatus {
  checkedIn: boolean;
  lastCheckIn: string | null;
}

const STORAGE_KEY = "pufi-checkin";

export const CHECKIN_EVENT =
  "pufi-checkin-changed";

function isSameDay(
  a: Date,
  b: Date
): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function notifyCheckInChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(
        CHECKIN_EVENT
      )
    );
  }
}

let status: CheckInStatus | null = null;

function ensureStatus(): CheckInStatus {
  if (status === null) {
    status =
      load<CheckInStatus>(
        STORAGE_KEY
      ) ?? {
        checkedIn: false,
        lastCheckIn: null,
      };
  }

  return status;
}

export function getCheckInStatus(): CheckInStatus {
  return ensureStatus();
}

export function checkIn(): boolean {
  const currentStatus = ensureStatus();

  if (currentStatus.lastCheckIn) {
    const last = new Date(
      currentStatus.lastCheckIn
    );

    const today = new Date();

    if (isSameDay(last, today)) {
      return false;
    }
  }

  status = {
    checkedIn: true,
    lastCheckIn:
      new Date().toISOString(),
  };

  save(STORAGE_KEY, status);

  updateDailyStreak();

  addReward(10);

  unlockAchievement("first-checkin");

  recordCheckInActivity(10);

  notifyCheckInChanged();

  return true;
}

export function resetCheckIn(): void {
  status = {
    checkedIn: false,
    lastCheckIn: null,
  };

  remove(STORAGE_KEY);

  notifyCheckInChanged();
}