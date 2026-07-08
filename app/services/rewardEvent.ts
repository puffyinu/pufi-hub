import type { RewardEvent, RewardSource } from "@/app/types/rewardEvent";

export function createRewardEvent(
  source: RewardSource,
  amount: number
): RewardEvent {
  return {
    id: crypto.randomUUID(),
    source,
    amount,
    createdAt: new Date().toISOString(),
  };
}