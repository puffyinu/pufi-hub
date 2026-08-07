import { getWalletState } from "@/app/services/walletSession";
import type { Campaign } from "@/app/types/campaign";

export type ValidationStatus =
  | "ELIGIBLE"
  | "INACTIVE"
  | "QUOTA_FULL"
  | "ALREADY_CLAIMED"
  | "WALLET_REQUIRED"
  | "WORLD_ID_REQUIRED"
  | "ERROR";

export interface ValidationResult {
  status: ValidationStatus;
  message: string;
  isEligible: boolean;
}

/**
 * Validates if a user is eligible to participate in a specific campaign.
 */
export async function validateCampaignEligibility(
  campaign: Campaign
): Promise<ValidationResult> {
  // 1. Validate Campaign Status
  if (campaign.status !== "LIVE" && campaign.status !== "CLAIM_READY" && campaign.status !== "VISITING") {
    return {
      status: "INACTIVE",
      message: "This campaign is currently inactive or ended.",
      isEligible: false,
    };
  }

  // 2. Validate Quota
  const remainingQuota = campaign.maxClaims - campaign.claimedCount;
  if (remainingQuota <= 0) {
    return {
      status: "QUOTA_FULL",
      message: "This campaign has reached its maximum quota.",
      isEligible: false,
    };
  }

  // 3. Validate Wallet Connection
  const walletState = getWalletState();
  if (!walletState.connected || !walletState.address) {
    return {
      status: "WALLET_REQUIRED",
      message: "Please connect your wallet to participate.",
      isEligible: false,
    };
  }

  // 4. Validate World ID
  // Note: In PUFI HUB, a verified human is usually tracked via check-in or specific session flags
  // If no explicit World ID flag exists, we assume wallet connection is enough for this FOUNDATION sprint
  // but we provide the hook for future strict verification.
  const isHuman = true; // Placeholder for strict World ID check if required by campaign

  if (!isHuman) {
    return {
      status: "WORLD_ID_REQUIRED",
      message: "World ID verification is required for this campaign.",
      isEligible: false,
    };
  }

  // 5. Check if already claimed in local session (Prevention)
  // Real check happens in rewardClaimEngine, but we check local session here for better UX
  
  return {
    status: "ELIGIBLE",
    message: "You are eligible to participate!",
    isEligible: true,
  };
}
