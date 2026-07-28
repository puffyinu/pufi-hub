import { WORLD_CONFIG } from "@/app/config/world";

export interface WorldVerifyResponse {
  success: boolean;
  error?: string;
}

export function isWorldVerifyConfigured(): boolean {
  return (
    WORLD_CONFIG.appId.trim() !== "" &&
    WORLD_CONFIG.action.trim() !== "" &&
    WORLD_CONFIG.rpId.trim() !== ""
  );
}

export function getWorldVerifyConfig() {
  return {
    appId: WORLD_CONFIG.appId,
    action: WORLD_CONFIG.action,
    rpId: WORLD_CONFIG.rpId,
  };
}

export async function verifyWorldId(): Promise<WorldVerifyResponse> {
  try {
    const response = await fetch("/api/world/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  } catch {
    return {
      success: false,
      error: "Unable to reach verification service.",
    };
  }
}