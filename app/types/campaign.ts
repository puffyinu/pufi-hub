export interface Campaign {
  id: string;

  title: string;

  description: string;

  reward: number;

  completed: boolean;
}

export interface CampaignState {
  campaigns: Campaign[];
}