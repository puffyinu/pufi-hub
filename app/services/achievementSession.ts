import { provider } from "@/app/providers/providerAccess";

import type {
  Achievement,
  AchievementState,
} from "@/app/types/achievement";

const STORAGE_KEY =
  "pufi-achievement-session";

export const ACHIEVEMENT_SESSION_EVENT =
  "pufi-achievement-session-changed";

const DEFAULT_STATE: AchievementState = {
  achievements: [
    {
      id: "first-checkin",
      title: "First Check-In",
      description:
        "Complete your first daily check-in.",
      unlocked: false,
    },
    {
      id: "streak-7",
      title: "7 Day Streak",
      description:
        "Reach a 7-day daily streak.",
      unlocked: false,
    },
  ],
};

let session: AchievementState | null = null;

function storage() {
  return provider();
}

function notify(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(
        ACHIEVEMENT_SESSION_EVENT
      )
    );
  }
}

function ensureState(): AchievementState {
  if (session === null) {
    session =
      storage().load<AchievementState>(
        STORAGE_KEY
      ) ?? DEFAULT_STATE;
  }

  return session;
}

export function getAchievementState(): AchievementState {
  return ensureState();
}

export function getAchievements(): Achievement[] {
  return ensureState().achievements;
}

export function saveAchievements(
  achievements: Achievement[]
): void {
  session = {
    achievements,
  };

  storage().save(STORAGE_KEY, session);

  notify();
}

export function resetAchievements(): void {
  session = {
    ...DEFAULT_STATE,
  };

  storage().remove(STORAGE_KEY);

  notify();
}