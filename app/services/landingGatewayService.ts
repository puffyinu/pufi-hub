import { isMiniKitReady } from "@/app/runtime/minikitManager";
import { login } from "@/app/runtime/auth";
import { isDevelopmentRuntime } from "@/app/runtime/runtimeMode";
import { createDevelopmentSession } from "@/app/runtime/development";

export interface LandingGatewayResult {
  success: boolean;
  error?: string;
}

/**
 * Orchestrates the Landing Gateway process.
 * 1. Validates if MiniKit is ready (World App environment).
 * 2. Performs World Wallet authentication (login).
 */
export async function executeLandingGateway(): Promise<LandingGatewayResult> {
  try {
    console.log("[TRACE-1] executeLandingGateway()");
    
if (isDevelopmentRuntime()) {
  console.log("[DEV] Development Runtime detected");

  await createDevelopmentSession();

  return {
    success: true,
  };
}

    console.log("[TRACE-2] isMiniKitReady =", isMiniKitReady());

    if (!isMiniKitReady()) {
      console.log("[TRACE-3] MiniKit NOT Ready");

      return {
        success: false,
        error: "Please open PUFI HUB inside the World App.",
      };
    }

    console.log("[TRACE-4] Calling login()");

    const loginResult = await login();

    console.log("[TRACE-5] login() returned:", loginResult);

    if (!loginResult) {
      console.log("[TRACE-6] loginResult = false");

      return {
        success: false,
        error: "Connection failed. Please authorize the wallet request in World App.",
      };
    }

    console.log("[TRACE-7] executeLandingGateway SUCCESS");

    return {
      success: true,
    };
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
