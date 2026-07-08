import { getCheckInState } from "@/app/services/checkinSession";

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

  if (!state.checkedIn) {
    return false;
  }

  if (!state.lastCheckIn) {
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

export function getLastCheckInDate(): Date | null {
  const state = getCheckInState();

  if (!state.lastCheckIn) {
    return null;
  }

  return new Date(state.lastCheckIn);
}