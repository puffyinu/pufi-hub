export type CampaignStatus =
  | "ACTIVE"
  | "CLAIMED"
  | "COMPLETED"
  | "PAUSED"
  | "ENDED";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  logo: string;
  miniAppUrl: string;
  rewardToken: string;
  rewardAmount: number;
  budget: number;
  totalClicks: number;
  remainingClicks: number;
  status: CampaignStatus;
  createdAt: string;
  createdBy: string;
}

export interface CampaignState {
  campaigns: Campaign[];
}