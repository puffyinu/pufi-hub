import { getCampaigns, updateCampaign } from "@/app/services/campaignEngine";
import type { Campaign } from "@/app/types/campaign";

const MIN_VISIT_DURATION = 10000; // 10 seconds
const VISIT_TIMEOUT = 600000; // 10 minutes

/**
 * Generates a unique visit ID.
 */
function generateVisitId(campaignId: string): string {
  return `${campaignId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Starts a visit session for a campaign.
 */
export function startVisit(campaignId: string): { success: boolean; message?: string } {
  const campaigns = getCampaigns();

  // 0. Enforce Single Active Visit Session
  const hasActiveVisit = campaigns.some((c) => c.status === "VISITING");
  if (hasActiveVisit) {
    return { success: false, message: "Only one active visit session is allowed. Please complete or cancel your current visit first." };
  }

  const campaign = campaigns.find((c) => c.id === campaignId);

  // 1. Validate Campaign exists
  if (!campaign) {
    return { success: false, message: "Campaign not found." };
  }

  // 2. Validate Campaign status is LIVE
  if (campaign.status !== "LIVE") {
    return { success: false, message: "Campaign is not active." };
  }

  // 3. Validate Mini App URL exists
  if (!campaign.miniAppUrl) {
    return { success: false, message: "Campaign URL is missing." };
  }

  // Start Session
  const visitId = generateVisitId(campaignId);
  const now = new Date().toISOString();

  const updatedCampaign: Campaign = {
    ...campaign,
    status: "VISITING",
    visitId,
    visitStartedAt: now,
    visitCompleted: false,
    claimReady: false,
    visitExpired: false,
  };

  const success = updateCampaign(updatedCampaign);
  
  if (success) {
    // Open Campaign URL
    window.open(campaign.miniAppUrl, "_blank");
    return { success: true };
  }

  return { success: false, message: "Failed to start visit session." };
}

/**
 * Cancels an active visit session.
 */
export function cancelVisit(campaignId: string): boolean {
  const campaigns = getCampaigns();
  const campaign = campaigns.find((c) => c.id === campaignId);
  if (!campaign) return false;

  const updatedCampaign: Campaign = {
    ...campaign,
    status: "LIVE",
    visitId: undefined,
    visitStartedAt: undefined,
    visitCompletedAt: undefined,
    visitCompleted: false,
    claimReady: false,
    visitExpired: false,
  };

  return updateCampaign(updatedCampaign);
}

/**
 * Validates and completes a visit session.
 */
export function completeVisit(campaignId: string): { success: boolean; message?: string } {
  const campaigns = getCampaigns();
  const campaign = campaigns.find((c) => c.id === campaignId);

  if (!campaign) {
    return { success: false, message: "Campaign not found." };
  }

  if (campaign.status !== "VISITING") {
    return { success: false, message: "No active visit session found." };
  }

  if (!campaign.visitStartedAt) {
    return { success: false, message: "Visit start time missing." };
  }

  const now = Date.now();
  const startTime = new Date(campaign.visitStartedAt).getTime();
  const duration = now - startTime;

  // 1. Timeout Check (10 minutes)
  if (duration > VISIT_TIMEOUT) {
    expireVisit(campaignId);
    return { success: false, message: "Visit session expired (10 minute timeout)." };
  }

  // 2. Duration Check (10 seconds)
  if (duration < MIN_VISIT_DURATION) {
    // Invalidate visit: return to LIVE
    const updatedCampaign: Campaign = {
      ...campaign,
      status: "LIVE",
      visitId: undefined,
      visitStartedAt: undefined,
      visitExpired: false,
    };
    updateCampaign(updatedCampaign);
    return { success: false, message: "Visit too short. Stay in advertiser app for at least 10 seconds." };
  }

  // 3. Success Validation: VISITING -> VISITED -> CLAIM_READY
  const nowIso = new Date().toISOString();
  const visitedCampaign: Campaign = {
    ...campaign,
    status: "VISITED",
    visitCompleted: true,
    visitCompletedAt: nowIso,
  };
  
  // Update to VISITED first
  updateCampaign(visitedCampaign);

  // Then transition to CLAIM_READY
  const readyCampaign: Campaign = {
    ...visitedCampaign,
    status: "CLAIM_READY",
    claimReady: true,
  };

  const success = updateCampaign(readyCampaign);
  
  if (success) {
    return { success: true };
  }

  return { success: false, message: "Failed to complete visit validation." };
}

/**
 * Force expires a visit session.
 */
export function expireVisit(campaignId: string): boolean {
  const campaigns = getCampaigns();
  const campaign = campaigns.find((c) => c.id === campaignId);
  if (!campaign) return false;

  const updatedCampaign: Campaign = {
    ...campaign,
    status: "LIVE",
    visitId: undefined,
    visitStartedAt: undefined,
    visitCompleted: false,
    claimReady: false,
    visitExpired: true,
  };

  return updateCampaign(updatedCampaign);
}

/**
 * Detects return to PUFI HUB and attempts to complete the active visit.
 */
export function handleReturnToApp(onComplete?: (campaignId: string) => void): void {
  const campaigns = getCampaigns();
  
  // Find campaign in VISITING state
  const activeVisit = campaigns.find((c) => c.status === "VISITING");

  if (activeVisit) {
    const result = completeVisit(activeVisit.id);
    if (result.success && onComplete) {
      onComplete(activeVisit.id);
    } else if (!result.success && result.message) {
        // Show alert for invalid/expired visit if it was active
        alert(result.message);
    }
  }
}

/**
 * Periodically checks for expired visits.
 */
export function checkTimeouts(): void {
  const campaigns = getCampaigns();
  const now = Date.now();
  
  campaigns.forEach((c) => {
    if (c.status === "VISITING" && c.visitStartedAt) {
      const startTime = new Date(c.visitStartedAt).getTime();
      if (now - startTime > VISIT_TIMEOUT) {
        expireVisit(c.id);
      }
    }
  });
}
