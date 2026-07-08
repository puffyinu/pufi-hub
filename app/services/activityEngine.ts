import { addActivity } from "@/app/services/activitySession";

import type {
  Activity,
  ActivityType,
} from "@/app/types/activity";

function createActivity(
  type: ActivityType,
  title: string,
  description: string,
  amount?: number
): Activity {
  return {
    id: crypto.randomUUID(),
    type,
    title,
    description,
    amount,
    createdAt: new Date().toISOString(),
  };
}

export function recordActivity(
  type: ActivityType,
  title: string,
  description: string,
  amount?: number
): void {
  addActivity(
    createActivity(
      type,
      title,
      description,
      amount
    )
  );
}

export function recordCheckInActivity(
  amount: number
): void {
  recordActivity(
    "checkin",
    "Daily Check-In",
    "Daily reward claimed",
    amount
  );
}

export function recordRewardClaimActivity(
  amount: number
): void {
  recordActivity(
    "claim",
    "Reward Claimed",
    "Reward successfully claimed",
    amount
  );
}