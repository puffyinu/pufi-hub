import { parseAbi } from "viem";

export const PUFI_CONTRACT = process.env.NEXT_PUBLIC_PUFI_CONTRACT as `0x${string}`;
export const USDC_CONTRACT = process.env.NEXT_PUBLIC_USDC_CONTRACT as `0x${string}`;
export const WLD_CONTRACT = process.env.NEXT_PUBLIC_WLD_CONTRACT as `0x${string}`;

export function getSettlementContract(): `0x${string}` {
  const settlement = process.env.NEXT_PUBLIC_SETTLEMENT_CONTRACT;
  if (!settlement) {
    throw new Error("NEXT_PUBLIC_SETTLEMENT_CONTRACT is missing");
  }
  return settlement as `0x${string}`;
}

export const TOKEN_CONTRACTS = {
  PUFI: PUFI_CONTRACT,
  USDC: USDC_CONTRACT,
  WLD: WLD_CONTRACT,
} as const;

export type SupportedToken = keyof typeof TOKEN_CONTRACTS;

export const SETTLEMENT_ABI = parseAbi([
  "function settleCampaign(string campaignId, address token, uint256 campaignBudget, address advertiser) external",
  "event CampaignSettled(string indexed campaignId, address indexed advertiser, address indexed token, uint256 campaignBudget, uint256 platformFee, uint256 rewardPool)",
  "event PlatformFeeTransferred(address indexed platformWallet, address indexed token, uint256 amount)",
  "event RewardPoolFunded(address indexed rewardWallet, address indexed token, uint256 amount)",
]);

export const ERC20_TRANSFER_ABI = parseAbi([
  "function transfer(address to, uint256 amount) returns (bool)",
]);

export const ERC20_ABI = parseAbi([
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
]);
