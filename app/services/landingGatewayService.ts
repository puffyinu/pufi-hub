import { isMiniKitReady } from "@/app/runtime/minikitManager";
import { login } from "@/app/runtime/auth";

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
    // Step 1: Runtime Validation
    if (!isMiniKitReady()) {
      return {
        success: false,
        error: "Please open PUFI HUB inside the World App.",
      };
    }

    // Step 2: Authentication Orchestration
    // The login() function handles walletAuth and session management internally.
    const loginResult = await login();

    if (!loginResult) {
      return {
        success: false,
        error: "Connection failed. Please authorize the wallet request in World App.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("LandingGatewayService: Unexpected error", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected authentication error occurred.",
    };
  }
}
