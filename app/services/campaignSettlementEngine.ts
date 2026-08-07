import { calculateSettlement } from "./campaignSettlementService";

import { wallets } from "@/app/config/wallets";

export interface SettlementPlan {
  campaignBudget: number;
  platformFee: number;
  rewardPool: number;
  maximumClaims: number;
  platformWallet: string;
  rewardTreasury: string;
  rewardToken: string;
}

/**
 * Builds a settlement plan, validating the budget and calculating the fee/pool distribution.
 */
export function buildSettlementPlan(
  campaignBudget: number,
  rewardPerClick: number,
  rewardToken: string
): SettlementPlan {
  if (campaignBudget <= 0) {
    throw new Error("Invalid campaign budget: must be greater than zero.");
  }
  if (rewardPerClick <= 0) {
    throw new Error("Invalid reward per click: must be greater than zero.");
  }

  const settlement = calculateSettlement(campaignBudget);
  const maximumClaims = Math.floor(settlement.rewardPool / rewardPerClick);

  return {
    campaignBudget,
    ...settlement,
    maximumClaims,
    platformWallet: wallets.platform,
    rewardTreasury: wallets.reward,
    rewardToken,
  };
}
