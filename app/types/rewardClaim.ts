import { ValidationResult } from "@/app/services/validationEngine";

export type RewardClaimStatus =
  | "PENDING"
  | "READY"
  | "CLAIMING"
  | "CLAIMED"
  | "FAILED"
  | "EXPIRED";

export interface PendingReward {
  id: string;
  campaignId: string;
  userId: string;
  walletAddress: string;
  token: string;
  amount: number;
  status: RewardClaimStatus;
  createdAt: string;
  expiresAt: string;
  validationResult: ValidationResult;
}

export interface RewardClaimQueueState {
  rewards: PendingReward[];
}