export type RewardClaimStatus =
  | "idle"
  | "ready"
  | "claiming"
  | "claimed"
  | "failed";

export interface RewardClaimState {
  status: RewardClaimStatus;
  amount: number;
  loading: boolean;
  error: string | null;
}