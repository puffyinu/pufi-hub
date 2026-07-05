import { load, save, remove } from "@/app/services/storage";
import { addReward } from "@/app/services/reward";

export interface CheckInStatus {
  checkedIn: boolean;
  lastCheckIn: string | null;
}

const STORAGE_KEY = "pufi-checkin";
export const CHECKIN_EVENT = "pufi-checkin-changed";

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function notifyCheckInChanged(): void {
  window.dispatchEvent(new CustomEvent(CHECKIN_EVENT));
}

let status: CheckInStatus =
  load<CheckInStatus>(STORAGE_KEY) ?? {
    checkedIn: false,
    lastCheckIn: null,
  };

export function getCheckInStatus(): CheckInStatus {
  return status;
}

export function checkIn(): boolean {
  if (status.lastCheckIn) {
    const last = new Date(status.lastCheckIn);
    const today = new Date();

    if (isSameDay(last, today)) {
      return false;
    }
  }

  status = {
    checkedIn: true,
    lastCheckIn: new Date().toISOString(),
  };

  save(STORAGE_KEY, status);
  addReward(10);
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
