import { SettlementPlan } from "./campaignSettlementEngine";
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
import { setRewardState, getRewardState } from "@/app/services/rewardSession";
import { getCampaignCapacity } from "@/app/services/campaignUnlockService";
import { supabaseClient } from "./supabaseClient";

import type { Campaign, CampaignStatus } from "@/app/types/campaign";

const DEFAULT_LOGO = "/images/brand/pufi-logo.png";

/**
 * Fetches active campaigns from Supabase and synchronizes them with the local session.
 */
export async function fetchActiveCampaigns(): Promise<Campaign[]> {
  const { data, error } = await supabaseClient
    .from("campaigns")
    .select("*")
    .eq("status", "LIVE");

  if (error) {
    console.error("Failed to fetch campaigns from Supabase", error);
    throw error;
  }

  const dbCampaigns: Campaign[] = data.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description || "",
    logo: item.logo || DEFAULT_LOGO,
    miniAppUrl: item.mini_app_url || "",
    rewardToken: item.reward_token,
    rewardAmount: Number(item.reward_per_claim),
    budget: Number(item.pool_amount),
    maxClaims: item.max_claims,
    claimedCount: item.claimed_count,
    status: item.status as CampaignStatus,
    createdAt: item.created_at,
    createdBy: item.created_by,
  }));

  // Sync with session: Keep local status if it's more specific (e.g., VISITING, CLAIM_READY, CLAIMED)
  const sessionCampaigns = getSessionCampaigns();
  const syncedCampaigns = dbCampaigns.map((db) => {
    const local = sessionCampaigns.find((s) => s.id === db.id);
    if (local) {
      // If local is in a state that means user is interacting, keep it
      const activeStates: CampaignStatus[] = ["VISITING", "VISITED", "CLAIM_READY", "CLAIMING", "CLAIMED"];
      if (activeStates.includes(local.status)) {
        return {
          ...db,
          status: local.status,
          visitId: local.visitId,
          visitStartedAt: local.visitStartedAt,
          visitCompletedAt: local.visitCompletedAt,
          visitCompleted: local.visitCompleted,
          claimReady: local.claimReady,
          visitExpired: local.visitExpired,
        };
      }
    }
    return db;
  });

  saveCampaigns(syncedCampaigns);
  return syncedCampaigns;
}

/**
 * Returns all campaigns from the session.
 */
export function getCampaigns(): Campaign[] {
  return getSessionCampaigns();
}

/**
 * Returns a specific campaign by ID.
 * First checks local session, then falls back to Supabase.
 */
export async function getCampaignById(id: string): Promise<Campaign | null> {
  // Check local session first (preserves interactive states)
  const local = getSessionCampaigns().find((c) => c.id === id);
  if (local) return local;

  // Fallback to Supabase
  const { data, error } = await supabaseClient
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Campaign not found in Supabase", error);
    return null;
  }

  const campaign: Campaign = {
    id: data.id,
    title: data.title,
    description: data.description || "",
    logo: data.logo || DEFAULT_LOGO,
    miniAppUrl: data.mini_app_url || "",
    rewardToken: data.reward_token,
    rewardAmount: Number(data.reward_per_claim),
    budget: Number(data.pool_amount),
    maxClaims: data.max_claims,
    claimedCount: data.claimed_count,
    status: data.status as CampaignStatus,
    createdAt: data.created_at,
    createdBy: data.created_by,
  };

  return campaign;
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
    (c) => (c.status === "LIVE" || c.status === "CLAIM_READY") && c.claimedCount < c.maxClaims
  );
}

/**
 * Checks whether an advertiser has remaining campaign capacity.
 */
export function canCreateCampaign(userId: string): boolean {
  const myCampaigns = getMyCampaigns(userId);
  return myCampaigns.length < getCampaignCapacity();
}

/**
 * Creates a new campaign.
 */
export function createCampaign(
  campaign: Omit<Campaign, "id" | "status" | "createdAt" | "claimedCount">,
  settlementPlan: SettlementPlan
): Campaign {
  if (!campaign.createdBy) {
    throw new Error("Missing advertiser: 'createdBy' is required.");
  }

  if (!canCreateCampaign(campaign.createdBy)) {
    throw new Error("Campaign capacity reached.");
  }

  if (settlementPlan.maximumClaims <= 0) {
    throw new Error("Invalid campaign data: 'maximumClaims' must be greater than zero.");
  }

  const id = `campaign-${Date.now()}`;

  const newCampaign: Campaign = {
    ...campaign,
    id,
    logo: campaign.logo || DEFAULT_LOGO,
    status: "LIVE",
    claimedCount: 0,
    createdAt: new Date().toISOString(),
    // Use plan values
    maxClaims: settlementPlan.maximumClaims,
    budget: settlementPlan.campaignBudget,
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
export function addPool(id: string, additionalClaims: number, additionalBudget: number, rewardToken?: string): boolean {
  const campaigns = getSessionCampaigns();
  const campaign = campaigns.find((c) => c.id === id);
  if (!campaign) return false;

  const updatedCampaign: Campaign = {
    ...campaign,
    rewardToken: rewardToken || campaign.rewardToken,
    maxClaims: campaign.maxClaims + additionalClaims,
    // Stabilize budget arithmetic
    budget: Math.round((campaign.budget + additionalBudget) * 1e6) / 1e6,
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

  // Requirement: Must be CLAIM_READY to claim
  if (!campaign || campaign.status !== "CLAIM_READY") return false;

  // Transition to CLAIMING
  const claimingCampaign: Campaign = {
    ...campaign,
    status: "CLAIMING",
  };
  updateCampaignInSession(claimingCampaign);

  const updatedCount = campaign.claimedCount + 1;
  // Flow: CLAIMING -> CLAIMED -> COMPLETED (if pool empty)
  const finalStatus = updatedCount >= campaign.maxClaims ? "COMPLETED" : "CLAIMED";

  const updatedCampaign: Campaign = {
    ...campaign,
    claimedCount: updatedCount,
    status: finalStatus,
    visitId: undefined,
    visitStartedAt: undefined,
    visitCompletedAt: undefined,
    visitCompleted: false,
    claimReady: false,
    visitExpired: false,
  };

  const success = updateCampaignInSession(updatedCampaign);

  if (success) {
    // Add reward to pending pool
    const rewardState = getRewardState();
    const currentTokenAmount = rewardState.pendingByToken[campaign.rewardToken] || 0;
    
    // Stabilize arithmetic to prevent floating point drift (e.g. 0.1 + 0.2 = 0.30000000000000004)
    // We use a precision of 6 decimals which is sufficient for PUFI/USDC/WLD business logic
    const nextPending = Math.round(((rewardState.pending || 0) + campaign.rewardAmount) * 1e6) / 1e6;
    const nextTokenAmount = Math.round((currentTokenAmount + campaign.rewardAmount) * 1e6) / 1e6;

    setRewardState({
      pending: nextPending,
      pendingByToken: {
        ...rewardState.pendingByToken,
        [campaign.rewardToken]: nextTokenAmount
      }
    });

    addReward(campaign.rewardAmount);
    recordActivity(
      "campaign",
      `Claimed: ${campaign.title}`,
      `You earned ${campaign.rewardAmount} ${campaign.rewardToken}`,
      campaign.rewardAmount
    );

    if (finalStatus === "COMPLETED") {
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
 */
export function dailyResetCampaigns(): void {
  const campaigns = getSessionCampaigns();
  const updated = campaigns.map((c) => {
    // Reset active visit states to LIVE
    if (
      c.status === "VISITING" ||
      c.status === "VISITED" ||
      c.status === "CLAIM_READY" ||
      c.status === "CLAIMING"
    ) {
      return {
        ...c,
        status: "LIVE" as const,
        visitId: undefined,
        visitStartedAt: undefined,
        visitCompletedAt: undefined,
        visitCompleted: false,
        claimReady: false,
        visitExpired: false,
      };
    }

    // CLAIMED campaigns return to LIVE if pool has space
    if (c.status === "CLAIMED") {
      if (c.claimedCount < c.maxClaims) {
        return { ...c, status: "LIVE" as const };
      }
    }

    // COMPLETED campaigns only return to LIVE if remainingPool > 0
    if (c.status === "COMPLETED") {
      if (c.claimedCount < c.maxClaims) {
        return { ...c, status: "LIVE" as const };
      }
    }

    return c;
  });
  saveCampaigns(updated);
}

export { resetCampaigns };
