import { isMiniKitReady } from "@/app/runtime/minikitManager";
import { isDevelopmentRuntime } from "@/app/runtime/runtimeMode";
import { createDevelopmentSession } from "@/app/runtime/development";
import { WORLD_CONFIG } from "@/app/config/world";
import { getRuntimeHealth } from "@/app/services/runtimeHealth";
import { refreshRuntimeState } from "@/app/services/runtimeSession";
import { connectAndVerifyWallet } from "@/app/services/walletConnectFlow";

export interface LandingGatewayResult {
  success: boolean;
  error?: string;
}

export async function executeLandingGateway(): Promise<LandingGatewayResult> {
  try {
    console.log("[TRACE-1] executeLandingGateway()");

    if (isDevelopmentRuntime()) {
      console.log("[DEV] Development Runtime detected");
      await createDevelopmentSession();
      return { success: true };
    }
    if (!WORLD_CONFIG.appId || WORLD_CONFIG.appId.trim() === "") {
      console.error("[TRACE] Missing NEXT_PUBLIC_WORLD_APP_ID");
      return {
        success: false,
        error: "World App is not configured. Missing NEXT_PUBLIC_WORLD_APP_ID.",
      };
    }
    console.log("[TRACE-2] Refreshing Runtime State");
    refreshRuntimeState();
    const health = getRuntimeHealth();
    console.log("[RUNTIME HEALTH]", health);
    if (health.initialized === true && health.miniKitReady === false) {
      console.warn("[TRACE-3] MiniKit NOT Ready in state");
      return {
        success: false,
        error: "MiniKit runtime is not available.",
      };
    }
    console.log("[TRACE-4] isMiniKitReady =", isMiniKitReady());
    if (!isMiniKitReady()) {
      console.log("[TRACE-5] MiniKit NOT Ready in bridge");
      return {
        success: false,
        error: "Please open PUFI HUB inside the World App.",
      };
    }

    console.log("[TRACE-6] Calling connectAndVerifyWallet()");
    const connectResult = await connectAndVerifyWallet();
    console.log("[TRACE-7] connectAndVerifyWallet() returned:", connectResult);

    if (!connectResult.success) {
      return {
        success: false,
        error: connectResult.error ?? "Connection failed.",
      };
    }

    console.log("[TRACE-11] executeLandingGateway SUCCESS");
    return { success: true };
  } catch (error) {
    console.error("[TRACE-ERROR]", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unexpected authentication error",
    };
  }
}
