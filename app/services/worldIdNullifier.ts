import { supabaseAdmin } from "@/app/services/supabaseAdmin";

export async function recordWorldIdVerification(
  nullifiers: string[],
  action: string
): Promise<void> {
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
