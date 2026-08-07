import { parseAbi } from "viem";

export const PUFI_CONTRACT = process.env.NEXT_PUBLIC_PUFI_CONTRACT as `0x${string}`;
export const USDC_CONTRACT = process.env.NEXT_PUBLIC_USDC_CONTRACT as `0x${string}`;
export const WLD_CONTRACT = process.env.NEXT_PUBLIC_WLD_CONTRACT as `0x${string}`;

export const TOKEN_CONTRACTS: Record<string, `0x${string}`> = {
  PUFI: PUFI_CONTRACT,
  USDC: USDC_CONTRACT,
  WLD: WLD_CONTRACT,
};

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