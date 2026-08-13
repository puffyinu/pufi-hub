import { getSupabaseAdmin } from "@/app/services/supabaseAdmin";

export async function recordWorldIdVerification(
  nullifiers: string[],
  action: string
): Promise<void> {
  const supabaseAdmin = getSupabaseAdmin();

  const rows = nullifiers.map((nullifier) => ({
    nullifier,
    action,
    verified_at: new Date().toISOString(),
  }));

  const { error } = await supabaseAdmin
    .from("world_id_nullifiers")
    .upsert(rows, { onConflict: "nullifier,action" });

  if (error) {
    console.error("[NULLIFIER-STORE-ERROR]", error);
    throw new Error("Failed to record World ID verification.");
  }
}

export async function recordVerifiedWallet(
  address: string,
  nullifier: string
): Promise<void> {
  const supabaseAdmin = getSupabaseAdmin();

  const { error } = await supabaseAdmin
    .from("verified_wallets")
    .upsert(
      {
        wallet_address: address.toLowerCase(),
        nullifier,
        verified_at: new Date().toISOString(),
      },
      { onConflict: "wallet_address" }
    );

  if (error) {
    console.error("[VERIFIED-WALLET-STORE-ERROR]", error);
    throw new Error("Failed to record verified wallet.");
  }
}
