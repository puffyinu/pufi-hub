export const wallets = {
  platform:
    process.env.NEXT_PUBLIC_PLATFORM_WALLET ??
    process.env.PLATFORM_WALLET ??
    "0x442B525Ffd17cCd8B228b3f15b19B797A4Bb66Ed",

  reward:
    process.env.NEXT_PUBLIC_REWARD_WALLET ??
    process.env.REWARD_WALLET ??
    "0xD01482B99F59726b4F9fbb09B1138C546b0D0516",
} as const;
