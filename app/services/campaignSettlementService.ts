/**
 * CampaignSettlementService
 * 
 * Responsible for calculating the platform fee (30%) and the reward pool allocation (70%).
 * 
 * BUSINESS FLOW:
 * Total Budget = Platform Fee (30%) + Reward Pool (70%)
 */

export interface Settlement {
  platformFee: number;
  rewardPool: number;
  totalBudget: number;
}

const PLATFORM_FEE_PERCENTAGE = 0.30;
const REWARD_POOL_PERCENTAGE = 0.70;

/**
 * Calculates the settlement breakdown based on the total budget provided by the advertiser.
 */
export function calculateSettlement(totalBudget: number): Settlement {
  // Use a precision of 6 decimals to prevent floating point drift
  const platformFee = Math.round((totalBudget * PLATFORM_FEE_PERCENTAGE) * 1e6) / 1e6;
  const rewardPool = Math.round((totalBudget * REWARD_POOL_PERCENTAGE) * 1e6) / 1e6;

  return {
    platformFee,
    rewardPool,
    totalBudget,
  };
}
