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

  reward: number;

  status: CampaignStatus;
}

export interface CampaignState {
  campaigns: Campaign[];
}