import { load, save, remove } from "@/app/services/storage";
import { addReward } from "@/app/services/reward";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
}

export const CAMPAIGN_EVENT = "campaignUpdated";

const STORAGE_KEY = "pufi_campaigns";

const DEFAULT_CAMPAIGNS: Campaign[] = [
  {
    id: "campaign-1",
    title: "Visit Partner",
    description: "Visit our official partner page.",
    reward: 50,
    completed: false,
  },
  {
    id: "campaign-2",
    title: "Join Community",
    description: "Join the official PUFI community.",
    reward: 100,
    completed: false,
  },
  {
    id: "campaign-3",
    title: "Share Campaign",
    description: "Share this campaign with friends.",
    reward: 150,
    completed: false,
  },
];

function notifyCampaignUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CAMPAIGN_EVENT));
  }
}

function getCampaigns(): Campaign[] {
  const storedCampaigns = load<Campaign[]>(STORAGE_KEY);

  if (!storedCampaigns || storedCampaigns.length === 0) {
    saveCampaigns(DEFAULT_CAMPAIGNS);
    return DEFAULT_CAMPAIGNS;
  }

  return storedCampaigns;
}

function saveCampaigns(campaigns: Campaign[]): void {
  save(STORAGE_KEY, campaigns);
  notifyCampaignUpdated();
}

function completeCampaign(id: string): boolean {
  const campaigns = getCampaigns();
  const campaign = campaigns.find(item => item.id === id);

  if (!campaign || campaign.completed) {
    return false;
  }

  const updatedCampaigns = campaigns.map(item =>
    item.id === id
      ? { ...item, completed: true }
      : item
  );

  saveCampaigns(updatedCampaigns);
  addReward(campaign.reward);
  return true;
}

function resetCampaigns(): void {
  remove(STORAGE_KEY);
  saveCampaigns(DEFAULT_CAMPAIGNS);
}

export { getCampaigns, saveCampaigns, completeCampaign, resetCampaigns };
