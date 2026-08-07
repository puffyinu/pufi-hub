export const wallets = {
  platform:
    process.env.NEXT_PUBLIC_PLATFORM_WALLET ??
    process.env.PLATFORM_WALLET ??
    "",

  reward:
    process.env.NEXT_PUBLIC_REWARD_WALLET ??
    process.env.REWARD_WALLET ??
    "",
} as const;
