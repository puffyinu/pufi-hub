import { hasSession } from "@/app/services/session";
import { getRuntimeState } from "@/app/services/runtimeSession";
import { getWalletState } from "@/app/services/walletSession";

import type { RuntimeHealth } from "@/app/types/runtimeHealth";

export function getRuntimeHealth(): RuntimeHealth {
  const runtime = getRuntimeState();
  const wallet = getWalletState();

  return {
    initialized: runtime.initialized,
    miniKitReady: runtime.miniKitReady,
    sessionAvailable: hasSession(),
    walletConnected: wallet.connected,
    timestamp: new Date().toISOString(),
  };
}