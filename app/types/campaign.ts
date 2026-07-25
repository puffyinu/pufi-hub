export type CampaignStatus =
  | "LIVE"
  | "CLAIMED"
  | "COMPLETED"
  | "PAUSED"
  | "ENDED"
  | "ACTIVE"; // Keep ACTIVE for backward compatibility during migration

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
}

export interface CampaignState {
  campaigns: Campaign[];
}
