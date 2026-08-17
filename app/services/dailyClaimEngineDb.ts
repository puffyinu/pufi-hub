import { getSupabaseAdmin } from "@/app/services/supabaseAdmin";
import {
  sendPufiFromRewardWallet,
  validateRewardWalletTransfer,
  type RewardWalletPreflightErrorCode,
} from "@/app/services/rewardWalletClient";
import { sendWorldNotification } from "@/app/services/worldNotification";

const CLAIM_AMOUNT = 1; // 1 PUFI per day
const CLAIM_COOLDOWN_HOURS = 24;

export interface DailyClaimResult {
  success: boolean;
  txHash?: string;
  error?: string;
  code?: RewardWalletPreflightErrorCode;
  nextClaimAt?: string;
}

export async function processDailyClaim(
  walletAddress: string
): Promise<DailyClaimResult> {
  if (!walletAddress) {
    return { success: false, error: "Wallet address is required." };
  }

  const normalizedAddress = walletAddress.toLowerCase();
  const supabaseAdmin = getSupabaseAdmin();
  const cooldownMs = CLAIM_COOLDOWN_HOURS * 60 * 60 * 1000;
  const cutoff = new Date(Date.now() - cooldownMs).toISOString();

  const { data: recentClaims, error: fetchError } = await supabaseAdmin
    .from("daily_claims")
    .select("claimed_at")
    .eq("wallet_address", normalizedAddress)
    .gte("claimed_at", cutoff)
    .order("claimed_at", { ascending: false })
    .limit(1);

  if (fetchError) {
    console.error("[DAILY_CLAIM] Fetch error:", fetchError);
    return { success: false, error: "Database error while checking claim status." };
  }

  if (recentClaims && recentClaims.length > 0) {
    const lastClaimedAt = new Date(recentClaims[0].claimed_at);
    const nextClaimAt = new Date(lastClaimedAt.getTime() + cooldownMs);
    return {
      success: false,
      error: "You have already claimed today. Please try again later.",
      nextClaimAt: nextClaimAt.toISOString(),
    };
  }

  const preflight = await validateRewardWalletTransfer(normalizedAddress, CLAIM_AMOUNT);

  if (!preflight.success) {
    return {
      success: false,
      code: preflight.code,
      error: preflight.error,
    };
  }

  let txHash: string;
  try {
    const result = await sendPufiFromRewardWallet(normalizedAddress, preflight.amountInBaseUnits);
    txHash = result.txHash;
  } catch (error) {
    console.error("[DAILY_CLAIM] Transaction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Transaction failed.",
    };
  }

  const { error: insertError } = await supabaseAdmin.from("daily_claims").insert({
    wallet_address: normalizedAddress,
    amount: CLAIM_AMOUNT,
    token: "PUFI",
    tx_hash: txHash,
  });

  if (insertError) {
    console.error("[DAILY_CLAIM] Insert error:", insertError);
  }

  await supabaseAdmin.from("treasury_ledger").insert({
    entry_type: "DAILY_CLAIM_OUT",
    amount: CLAIM_AMOUNT,
    token: "PUFI",
    wallet_address: normalizedAddress,
    tx_hash: txHash,
    notes: "Daily claim reward",
  });

  try {
    const notifyResult = await sendWorldNotification({
      walletAddress: normalizedAddress,
      title: "Daily Claim Confirmed ✅",
      message: `You received ${CLAIM_AMOUNT} PUFI. Tap to view your portfolio.`,
      path: "/dashboard",
    });

    if (!notifyResult.success) {
      console.warn("[DAILY_CLAIM] Notification not sent:", notifyResult.error);
    }
  } catch (notifyError) {
    console.warn("[DAILY_CLAIM] Notification exception:", notifyError);
  }

  return { success: true, txHash };
}
