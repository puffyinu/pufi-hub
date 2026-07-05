export const WORLD_CONFIG = {
  appName: "PUFI HUB",

  appId:
    process.env.NEXT_PUBLIC_WORLD_APP_ID ?? "",

  appUrl:
    process.env.NEXT_PUBLIC_APP_URL ?? "",

  network: "worldchain",

  rpcUrl:
    process.env.NEXT_PUBLIC_RPC_URL ?? "",

  contractAddress:
    process.env.NEXT_PUBLIC_PUFI_CONTRACT ?? "",
} as const;
