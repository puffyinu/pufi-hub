import {
  getPendingRewards,
  addRewardToQueue,
  updateRewardStatus,
} from "@/app/services/rewardClaimSession";

import { sendMiniKitTransaction } from "@/app/runtime/minikitManager";
import { TOKEN_CONTRACTS, ERC20_TRANSFER_ABI } from "@/app/services/contracts";
import { encodeFunctionData, parseUnits } from "viem";

import type { PendingReward, RewardClaimStatus } from "@/app/types/rewardClaim";
import { ValidationResult } from "@/app/services/validationEngine";

/**
 * Adds a validated reward to the queue.
 */
export function queueReward(
  campaignId: string,
  userId: string,
  walletAddress: string,
  token: string,
  amount: number,
  validationResult: ValidationResult
): void {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h expiration

  const reward: PendingReward = {
    id: crypto.randomUUID(),
    campaignId,
    userId,
    walletAddress,
    token,
    amount,
    status: "PENDING",
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    validationResult,
  };

  addRewardToQueue(reward);
}

/**
 * Retrieves the reward queue and checks for expired rewards.
 */
export function getRewardQueue(): PendingReward[] {
  const rewards = getPendingRewards();
  const now = new Date();

  return rewards.map((reward) => {
    if (reward.status === "PENDING" && new Date(reward.expiresAt) < now) {
      updateRewardStatus(reward.id, "EXPIRED");
      return { ...reward, status: "EXPIRED" as RewardClaimStatus };
    }
    return reward;
  });
}

/**
 * Claims a ready reward on-chain via MiniKit.
 */
export async function claimReward(rewardId: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
  const rewards = getPendingRewards();
  const reward = rewards.find((r) => r.id === rewardId);

  if (!reward || reward.status !== "READY") {
    return { success: false, error: "Reward not found or not ready to claim." };
  }

  const tokenAddress = TOKEN_CONTRACTS[reward.token];
  if (!tokenAddress) {
    return { success: false, error: `Token ${reward.token} not configured.` };
  }

  updateRewardStatus(rewardId, "CLAIMING");

  try {
    // MiniKit transaction: withdrawReward(string token, uint256 amount)
    const tx = await sendMiniKitTransaction({
      transactions: [
        {
          to: tokenAddress,
          data: encodeFunctionData({
            abi: ERC20_TRANSFER_ABI,
            functionName: "transfer",
            args: [reward.walletAddress as `0x${string}`, parseUnits(reward.amount.toString(), 6)],
          }),
        },
      ],
      chainId: 480,
    });

    if (tx && tx.data && (tx.data as { transactionHash: string }).transactionHash) {
      updateRewardStatus(rewardId, "CLAIMED");
      return { success: true, txHash: (tx.data as { transactionHash: string }).transactionHash };
    }

    updateRewardStatus(rewardId, "FAILED");
    return { success: false, error: "Transaction failed." };

  } catch (error) {
    console.error("[CLAIM-REWARD-ERROR]", error);
    updateRewardStatus(rewardId, "FAILED");
    return { success: false, error: "Transaction execution failed." };
  }
}
