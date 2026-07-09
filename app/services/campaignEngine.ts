import {
  getCampaigns,
  saveCampaigns,
  resetCampaigns,
} from "@/app/services/campaignSession";

import type {
  Campaign,
} from "@/app/types/campaign";

export function getCampaignList(): Campaign[] {
  return getCampaigns();
}

export function completeCampaign(
  id: string
): boolean {
  const campaigns =
    getCampaigns();

  const campaign =
    campaigns.find(
      (item) => item.id === id
    );

  if (!campaign || campaign.completed) {
    return false;
  }

  const updated = campaigns.map(
    (item) =>
      item.id === id
        ? {
            ...item,
            completed: true,
          }
        : item
  );

  saveCampaigns(updated);

  return true;
}

export {
  resetCampaigns,
};