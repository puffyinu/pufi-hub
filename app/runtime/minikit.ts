import { miniKit } from "@/app/config/minikit";
import { WORLD_CONFIG } from "@/app/config/world";

export function getMiniKit() {
  return miniKit;
}

export function getWorldConfig() {
  return WORLD_CONFIG;
}

export function isMiniKitInstalled(): boolean {
  return miniKit.isInstalled();
}