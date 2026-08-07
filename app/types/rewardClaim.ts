export type RewardClaimStatus =
  | "idle"
  | "ready"
  | "claiming"
  | "claimed"
  | "failed";

export interface RewardClaimState {
  status: RewardClaimStatus;
  token: string | null;
  amount: number;
  txHash: string | null;
  loading: boolean;
  error: string | null;
}