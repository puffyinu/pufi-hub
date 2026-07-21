import {
  getCampaigns,
  saveCampaigns,
  resetCampaigns,
} from "@/app/services/campaignSession";

import { addReward } from "@/app/services/reward";
import { recordActivity } from "@/app/services/activityEngine";
import { unlockAchievement } from "@/app/services/achievementEngine";

import type { Campaign } from "@/app/types/campaign";

export function getCampaignList(): Campaign[] {
  return getCampaigns();
}

export function completeCampaign(
  id: string
): boolean {
  const campaigns = getCampaigns();

  const campaign = campaigns.find(
    (item) => item.id === id
  );

  if (!campaign || campaign.status !== "ACTIVE") {
  return false;
}

  const updated: Campaign[] = campaigns.map((item) =>
  item.id === id
    ? {
        ...item,
        status: "CLAIMED" as const,
      }
    : item
);

  saveCampaigns(updated);

  addReward(campaign.reward);

  recordActivity(
    "campaign",
    campaign.title,
    campaign.description,
    campaign.reward
  );

  unlockAchievement("first-campaign");

  return true;
}

export { resetCampaigns };