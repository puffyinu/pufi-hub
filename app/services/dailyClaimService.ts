import { performDailyCheckIn } from "./checkinEngine";
import { prepareRewardClaim } from "./rewardClaimEngine";

export interface DailyClaimResult {
  success: boolean;
  error?: string;
}

/**
 * Orchestrates the Daily Claim process.
 * 1. Performs the daily check-in (updates streak, achievements, internal wallet, activity).
 * 2. Prepares the reward claim state for the UI.
 */
export async function executeDailyClaim(): Promise<DailyClaimResult> {
  try {
    // Step 1: Perform Daily Check-In
    // This updates the RewardEngine (Internal Wallet) and ActivityEngine internally.
    const checkInSuccess = performDailyCheckIn();
    
    if (!checkInSuccess) {
      return {
        success: false,
        error: "You have already claimed today's reward or check-in failed.",
      };
    }

    // Step 2: Prepare Reward Claim
    // This transitions the claim session state to 'ready' with the available balance.
    const prepareSuccess = prepareRewardClaim();
    
    if (!prepareSuccess) {
      return {
        success: false,
        error: "Failed to prepare reward claim.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("DailyClaimService: Unexpected error", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred.",
    };
  }
}
