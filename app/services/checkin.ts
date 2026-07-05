import { load, save, remove } from "@/app/services/storage";

export interface CheckInStatus {
  checkedIn: boolean;
  lastCheckIn: string | null;
}

const STORAGE_KEY = "pufi-checkin";

let status: CheckInStatus =
  load<CheckInStatus>(STORAGE_KEY) ?? {
    checkedIn: false,
    lastCheckIn: null,
  };

export function getCheckInStatus(): CheckInStatus {
  return status;
}

export function checkIn(): void {
  status = {
    checkedIn: true,
    lastCheckIn: new Date().toISOString(),
  };

  save(STORAGE_KEY, status);
}

export function resetCheckIn(): void {
  status = {
    checkedIn: false,
    lastCheckIn: null,
  };

  remove(STORAGE_KEY);
}
