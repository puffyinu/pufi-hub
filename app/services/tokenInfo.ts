import { type Address } from "viem";
import { formatUnits } from "viem/utils";

import { publicClient } from "./viemClient";
import { ERC20_ABI, PUFI_CONTRACT } from "./contracts";

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

export async function getTokenInfo(): Promise<TokenInfo> {
  if (!PUFI_CONTRACT) {
    throw new Error("PUFI contract address is not configured.");
  }

  const contractAddress = PUFI_CONTRACT as Address;
  const abi = ERC20_ABI;

  const [name, symbol, decimals, totalSupply] =
    await Promise.all([
      publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "name",
      }),
      publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "symbol",
      }),
      publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "decimals",
      }),
      publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "totalSupply",
      }),
    ]);

  return {
    name: name as string,
    symbol: symbol as string,
    decimals: Number(decimals),
    totalSupply: formatUnits(
      totalSupply as bigint,
      Number(decimals)
    ),
  };
}