import { provider } from "@/app/providers/providerAccess";

import type {
  Activity,
  ActivityState,
} from "@/app/types/activity";

const STORAGE_KEY = "pufi-activity-session";

export const ACTIVITY_SESSION_EVENT =
  "pufi-activity-session-changed";

const DEFAULT_STATE: ActivityState = {
  activities: [],
};

let session: ActivityState | null = null;

function notify(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(ACTIVITY_SESSION_EVENT)
    );
  }
}

function storage() {
  return provider();
}

function ensureState(): ActivityState {
  if (session === null) {
    session =
      storage().load<ActivityState>(STORAGE_KEY) ??
      DEFAULT_STATE;
  }

  return session;
}

export function getActivityState(): ActivityState {
  return ensureState();
}

export function getActivities(): Activity[] {
  return ensureState().activities;
}

export function addActivity(
  activity: Activity
): void {
  const current = ensureState();

  session = {
    activities: [
      activity,
      ...current.activities,
    ],
  };

  storage().save(STORAGE_KEY, session);

  notify();
}

export function clearActivities(): void {
  session = {
    ...DEFAULT_STATE,
  };

  storage().remove(STORAGE_KEY);

  notify();
}