import {
  getCampaigns,
  saveCampaigns,
  resetCampaigns,
  addCampaign as addCampaignToSession,
} from "@/app/services/campaignSession";

import { addReward } from "@/app/services/reward";
import { recordActivity } from "@/app/services/activityEngine";
import { unlockAchievement } from "@/app/services/achievementEngine";

import type { Campaign } from "@/app/types/campaign";

export function getCampaignList(): Campaign[] {
  return getCampaigns();
}

export function createCampaign(
  campaign: Omit<Campaign, "id" | "status" | "createdAt" | "remainingClicks">
): Campaign {
  const newCampaign: Campaign = {
    ...campaign,
    id: `campaign-${Date.now()}`,
    status: "ACTIVE",
    remainingClicks: campaign.totalClicks,
    createdAt: new Date().toISOString(),
  };

  addCampaignToSession(newCampaign);
  return newCampaign;
}

export function completeCampaign(
  id: string
): boolean {
  const campaigns = getCampaigns();

  const campaign = campaigns.find(
    (item) => item.id === id
  );

  if (!campaign || campaign.status !== "ACTIVE" || campaign.remainingClicks <= 0) {
    return false;
  }

  const updated: Campaign[] = campaigns.map((item) =>
    item.id === id
      ? {
          ...item,
          remainingClicks: item.remainingClicks - 1,
          status: item.remainingClicks - 1 <= 0 ? ("COMPLETED" as const) : ("ACTIVE" as const),
        }
      : item
  );

  saveCampaigns(updated);

  addReward(campaign.rewardAmount);

  recordActivity(
    "campaign",
    campaign.title,
    campaign.description,
    campaign.rewardAmount
  );

  unlockAchievement("first-campaign");

  return true;
}

export { resetCampaigns };