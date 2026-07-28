import { WORLD_CONFIG } from "@/app/config/world";

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