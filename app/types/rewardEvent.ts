export type RewardSource =
  | "daily_checkin"
  | "campaign"
  | "referral"
  | "achievement"
  | "bonus";

export interface RewardEvent {
  id: string;
  source: RewardSource;
  amount: number;
  createdAt: string;
}