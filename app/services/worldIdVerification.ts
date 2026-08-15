"use client";
import { IDKit, proofOfHuman, isInWorldApp } from "@worldcoin/idkit-core";
import { WORLD_CONFIG } from "@/app/config/world";
import type { RpContext } from "@/app/types/rpContext";

export interface WorldIdVerificationResult {
  success: boolean;
  error?: string;
}

async function fetchRpContext(action: string): Promise<RpContext> {
  const response = await fetch("/api/world/rp-context", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action }),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error ?? "Failed to fetch RP context.");
  }
  return data.rpContext as RpContext;
}

export function isWorldAppEnvironment(): boolean {
  return isInWorldApp();
}

export async function verifyHuman(
  address?: string
): Promise<WorldIdVerificationResult> {
  try {
    if (!address) {
      return {
        success: false,
        error: "A connected wallet address is required for World ID verification.",
      };
    }

    const canonicalAddress = address.toLowerCase();

    if (!isInWorldApp()) {
      return {
        success: false,
        error: "Please open PUFI HUB inside the World App.",
      };
    }
    const action = WORLD_CONFIG.action || "verify-human";
    const rpContext = await fetchRpContext(action);
    const request = await IDKit.request({
      app_id: WORLD_CONFIG.appId as `app_${string}`,
      action,
      rp_context: rpContext,
      action_description: "Verify you are human to access PUFI HUB",
      allow_legacy_proofs: true,
      environment: "production",
    }).preset(proofOfHuman({ signal: canonicalAddress }));
    const completion = await request.pollUntilCompletion();
    if (!completion.success) {
      return {
        success: false,
        error: `World ID verification failed: ${completion.error}`,
      };
    }
    const verifyResponse = await fetch("/api/world/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        rp_id: rpContext.rp_id,
        idkitResponse: completion.result,
        address: canonicalAddress,
      }),
    });
    const verifyData = await verifyResponse.json();
    if (!verifyResponse.ok || !verifyData.success) {
      return {
        success: false,
        error: verifyData.error ?? "Backend verification failed.",
      };
    }
    return { success: true };
  } catch (error) {
    console.error("[VERIFY-HUMAN-ERROR]", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unexpected World ID verification error",
    };
  }
}
