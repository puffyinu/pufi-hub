export type CampaignStatus =
  | "LIVE"
  | "VISITING"
  | "VISITED"
  | "CLAIM_READY"
  | "CLAIMING"
  | "CLAIMED"
  | "COMPLETED"
  | "PAUSED"
  | "ENDED"
  | "ACTIVE";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  logo: string;
  miniAppUrl: string;
  rewardToken: string;
  rewardAmount: number;
  budget: number;
  maxClaims: number;
  claimedCount: number;
  status: CampaignStatus;
  createdAt: string;
  createdBy: string;
  // Visit Session Data
  visitId?: string;
  visitStartedAt?: string;
  visitCompletedAt?: string;
  visitCompleted?: boolean;
  claimReady?: boolean;
  visitExpired?: boolean;
}

export interface CampaignState {
  campaigns: Campaign[];
}
