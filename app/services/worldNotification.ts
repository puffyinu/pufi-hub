import { WORLD_CONFIG } from "@/app/config/world";

const WORLD_NOTIFICATION_ENDPOINT =
  "https://developer.worldcoin.org/api/v2/minikit/send-notification";

export interface SendWorldNotificationParams {
  walletAddress: string;
  title: string;
  message: string;
  path?: string;
}

export interface WorldNotificationResult {
  success: boolean;
  error?: string;
}

/**
 * Sends a World App push notification to a specific wallet address.
 * SERVER-SIDE ONLY - uses WORLD_DEV_PORTAL_API_KEY, never expose to client.
 *
 * This is intentionally best-effort: failures here must never fail the
 * caller's primary operation (e.g. a completed on-chain transfer).
 */
export async function sendWorldNotification(
  params: SendWorldNotificationParams
): Promise<WorldNotificationResult> {
  const apiKey = process.env.WORLD_DEV_PORTAL_API_KEY;

  if (!apiKey) {
    console.warn("[WORLD_NOTIFICATION] WORLD_DEV_PORTAL_API_KEY not configured - skipping.");
    return { success: false, error: "Notification service not configured." };
  }

  try {
    const response = await fetch(WORLD_NOTIFICATION_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_id: WORLD_CONFIG.appId,
        wallet_addresses: [params.walletAddress],
        title: params.title,
        message: params.message,
        mini_app_path: params.path
          ? `worldapp://mini-app?app_id=${WORLD_CONFIG.appId}&path=${params.path}`
          : undefined,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("[WORLD_NOTIFICATION] Failed:", response.status, errorText);
      return { success: false, error: "Notification delivery failed." };
    }

    return { success: true };
  } catch (error) {
    console.error("[WORLD_NOTIFICATION] Exception:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown notification error.",
    };
  }
}
