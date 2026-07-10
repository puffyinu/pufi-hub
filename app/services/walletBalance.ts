import { type Abi, type Address } from "viem";
import { formatEther, formatUnits } from "viem/utils";

import { publicClient } from "@/app/services/viemClient";
import { PUFI_CONTRACT, ERC20_ABI } from "./contracts";

export interface BalanceResult {
  wld: string;
  pufi: string;
}

export async function getWalletBalance(
  address?: string
): Promise<BalanceResult> {
const contractAddress = PUFI_CONTRACT as Address;

if (!PUFI_CONTRACT) {
  throw new Error("PUFI contract address is not configured.");
}

  if (!address) {
    return {
      wld: "0.00",
      pufi: "0.00",
    };
  }

  const addressToCheck = address as Address;
  const pufiAbi = ERC20_ABI as unknown as Abi;

  const [wldBalance, pufiBalance, decimals] = await Promise.all([
    publicClient.getBalance({ address: addressToCheck }),
    publicClient.readContract({
      address: contractAddress,
      abi: pufiAbi,
      functionName: "balanceOf",
      args: [addressToCheck],
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: pufiAbi,
      functionName: "decimals",
    }),
  ]);

  return {
    wld: Number(formatEther(wldBalance)).toFixed(4),
    pufi: Number(formatUnits(pufiBalance as bigint, decimals as number)).toFixed(4),
  };
}