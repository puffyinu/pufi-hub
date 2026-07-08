export type ActivityType =
  | "checkin"
  | "reward"
  | "claim"
  | "campaign"
  | "referral";

export interface Activity {
  id: string;

  type: ActivityType;

  title: string;

  description: string;

  amount?: number;

  createdAt: string;
}

export interface ActivityState {
  activities: Activity[];
}