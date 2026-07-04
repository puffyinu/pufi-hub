import { ethers } from "ethers";

import { provider } from "./provider";
import { PUFI_CONTRACT, ERC20_ABI } from "./contracts";

const contract = new ethers.Contract(
  PUFI_CONTRACT,
  ERC20_ABI,
  provider
);

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

export async function getTokenInfo(): Promise<TokenInfo> {
  const [name, symbol, decimals, totalSupply] =
    await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply(),
    ]);

  return {
    name,
    symbol,
    decimals: Number(decimals),
    totalSupply: ethers.formatUnits(
      totalSupply,
      decimals
    ),
  };
}