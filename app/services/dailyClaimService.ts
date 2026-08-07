import { performDailyCheckIn } from "./checkinEngine";
import { queueReward } from "./rewardClaimEngine";

export interface DailyClaimResult {
  success: boolean;
  error?: string;
}

/**
 * Orchestrates the Daily Claim process.
 */
export async function executeDailyClaim(): Promise<DailyClaimResult> {
  try {
    // Step 1: Perform Daily Check-In
    const checkInSuccess = performDailyCheckIn();
    
    if (!checkInSuccess) {
      return {
        success: false,
        error: "You have already claimed today's reward or check-in failed.",
      };
    }

    // Step 2: Queue the Reward
    queueReward("daily-checkin", "user-placeholder", "user-wallet-placeholder", "PUFI", 1, { status: "ELIGIBLE", isEligible: true, message: "Daily Check-in" });

    return { success: true };
  } catch (error) {
    console.error("DailyClaimService: Unexpected error", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred.",
    };
  }
}
