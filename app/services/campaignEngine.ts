import {
  getCampaigns as getSessionCampaigns,
  saveCampaigns,
  resetCampaigns,
  addCampaign as addCampaignToSession,
  updateCampaign as updateCampaignInSession,
  deleteCampaign as deleteCampaignInSession,
} from "@/app/services/campaignSession";

import { addReward } from "@/app/services/reward";
import { recordActivity } from "@/app/services/activityEngine";

import type { Campaign, CampaignStatus } from "@/app/types/campaign";

const DEFAULT_LOGO = "/images/brand/pufi-logo.png";
const FREE_SLOT_LIMIT = 2;

/**
 * Returns all campaigns from the session.
 */
export function getCampaigns(): Campaign[] {
  return getSessionCampaigns();
}

/**
 * Returns campaigns created by the current user.
 */
export function getMyCampaigns(userId: string): Campaign[] {
  return getSessionCampaigns().filter((c) => c.createdBy === userId);
}

/**
 * Returns campaigns that are LIVE and have remaining claims.
 * These are "Ready To Earn" campaigns.
 */
export function getReadyCampaigns(): Campaign[] {
  return getSessionCampaigns().filter(
    (c) => c.status === "LIVE" && c.claimedCount < c.maxClaims
  );
}

/**
 * Checks if an advertiser can create a new campaign (free slot limit).
 */
export function canCreateCampaign(userId: string): boolean {
  const myCampaigns = getMyCampaigns(userId);
  return myCampaigns.length < FREE_SLOT_LIMIT;
}

/**
 * Creates a new campaign.
 */
export function createCampaign(
  campaign: Omit<Campaign, "id" | "status" | "createdAt" | "claimedCount">
): Campaign {
  if (!campaign.createdBy) {
    throw new Error("Missing advertiser: 'createdBy' is required.");
  }

  if (campaign.maxClaims <= 0) {
    throw new Error("Invalid campaign data: 'maxClaims' must be greater than zero.");
  }

  const id = `campaign-${Date.now()}`;

  const newCampaign: Campaign = {
    ...campaign,
    id,
    logo: campaign.logo || DEFAULT_LOGO,
    status: "LIVE",
    claimedCount: 0,
    createdAt: new Date().toISOString(),
  };

  addCampaignToSession(newCampaign);
  return newCampaign;
}

/**
 * Updates an existing campaign (EDIT).
 */
export function updateCampaign(campaign: Campaign): boolean {
  const updatedCampaign: Campaign = {
    ...campaign,
    logo: campaign.logo || DEFAULT_LOGO,
    // Automatically calculate status
    status: (campaign.claimedCount >= campaign.maxClaims ? "COMPLETED" : (campaign.status === "COMPLETED" ? "LIVE" : campaign.status)) as CampaignStatus
  };
  return updateCampaignInSession(updatedCampaign);
}

/**
 * Adds more claims to the pool (ADD POOL).
 */
export function addPool(id: string, additionalClaims: number, additionalBudget: number): boolean {
  const campaigns = getSessionCampaigns();
  const campaign = campaigns.find((c) => c.id === id);
  if (!campaign) return false;

  const updatedCampaign: Campaign = {
    ...campaign,
    maxClaims: campaign.maxClaims + additionalClaims,
    budget: campaign.budget + additionalBudget,
    status: "LIVE", // Reactivate if it was completed
  };

  return updateCampaignInSession(updatedCampaign);
}

/**
 * Deletes a campaign.
 */
export function deleteCampaign(id: string): boolean {
  return deleteCampaignInSession(id);
}

/**
 * Records a successful claim.
 */
export function recordClaim(id: string): boolean {
  const campaigns = getSessionCampaigns();
  const campaign = campaigns.find((c) => c.id === id);

  if (!campaign || campaign.status !== "LIVE") return false;

  const updatedCount = campaign.claimedCount + 1;
  const updatedStatus = updatedCount >= campaign.maxClaims ? "COMPLETED" : "LIVE";

  const updatedCampaign: Campaign = {
    ...campaign,
    claimedCount: updatedCount,
    status: updatedStatus,
  };

  const success = updateCampaignInSession(updatedCampaign);

  if (success) {
    addReward(campaign.rewardAmount);
    recordActivity(
      "campaign",
      `Claimed: ${campaign.title}`,
      `You earned ${campaign.rewardAmount} ${campaign.rewardToken}`,
      campaign.rewardAmount
    );

    if (updatedStatus === "COMPLETED") {
      recordActivity(
        "campaign",
        `Completed: ${campaign.title}`,
        "This campaign has reached its maximum claims.",
        0
      );
    }
  }

  return success;
}

/**
 * Daily Reset Logic:
 * Campaigns with remaining claims should become active again.
 * (In our model, they stay LIVE if claimedCount < maxClaims).
 * This function could be used to clear per-user daily claim flags if implemented.
 */
export function dailyResetCampaigns(): void {
  const campaigns = getSessionCampaigns();
  const updated = campaigns.map((c) => {
    // If it was CLAIMED today (local user state), it should become LIVE again for them.
    // However, the requirement says "Campaigns with no remaining claims must never reactivate."
    // This is handled by our status logic: COMPLETED stays COMPLETED.
    if (c.status === "CLAIMED" && c.claimedCount < c.maxClaims) {
      return { ...c, status: "LIVE" as const };
    }
    return c;
  });
  saveCampaigns(updated);
}

export { resetCampaigns };
