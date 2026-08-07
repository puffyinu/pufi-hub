import { CREATOR_CONFIG } from "@/app/config/creator";

/**
 * Returns the campaign capacity currently available to a creator.
 *
 * Unlock persistence is intentionally deferred, so every creator receives
 * the configured free capacity during this phase.
 */
export function getCampaignCapacity(): number {
  return CREATOR_CONFIG.FREE_CAPACITY;
}

/**
 * Determines whether a creator could unlock another campaign slot.
 */
export function canUnlock(): boolean {
  return !isMaxCapacity();
}

/**
 * Determines whether a creator has reached the configured maximum capacity.
 */
export function isMaxCapacity(): boolean {
  return getCampaignCapacity() >= CREATOR_CONFIG.MAX_CAPACITY;
}

/**
 * Returns the configured price for the next campaign-capacity unlock.
 */
export function getNextUnlockPrice(): number {
  return CREATOR_CONFIG.UNLOCK_PRICE_USDC;
}
