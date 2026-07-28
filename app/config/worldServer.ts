export const WORLD_SERVER_CONFIG = {
  rpSigningKey: process.env.WORLD_RP_SIGNING_KEY ?? "",
  environment: process.env.WORLD_ENVIRONMENT ?? "production",
} as const;

export function validateWorldServerConfig() {
  return (
    WORLD_SERVER_CONFIG.rpSigningKey.trim() !== "" &&
    WORLD_SERVER_CONFIG.environment.trim() !== ""
  );
}