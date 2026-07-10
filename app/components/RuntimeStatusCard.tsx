"use client";

import { useRuntime } from "@/app/hooks/useRuntime";
import { useRuntimeHealth } from "@/app/hooks/useRuntimeHealth";

export default function RuntimeStatusCard() {
  const { runtime, refresh } = useRuntime();
  const health = useRuntimeHealth();

  return (
    <div
      style={{
        background: "#1E293B",
        borderRadius: 16,
        padding: 20,
        color: "#FFFFFF",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h3>Runtime Status</h3>

        <button
          onClick={refresh}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      <p>
        Initialized:
        {" "}
        {runtime.initialized ? "✅" : "❌"}
      </p>

      <p>
        MiniKit Ready:
        {" "}
        {runtime.miniKitReady ? "✅" : "❌"}
      </p>

      <p>
        Session:
        {" "}
        {health.sessionAvailable ? "✅" : "❌"}
      </p>

      <p>
        Wallet:
        {" "}
        {health.walletConnected ? "✅" : "❌"}
      </p>

      <p>
        Last Sync:
        {" "}
        {runtime.lastSync ?? "-"}
      </p>
    </div>
  );
}