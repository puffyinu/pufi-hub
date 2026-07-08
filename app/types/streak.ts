export interface StreakState {
  currentStreak: number;
  bestStreak: number;
  lastCheckIn: string | null;
  updatedAt: string | null;
}

export const DEFAULT_STREAK_STATE: StreakState = {
  currentStreak: 0,
  bestStreak: 0,
  lastCheckIn: null,
  updatedAt: null,
};