import { publicClient } from "@/app/services/viemClient";
import { ERC20_ABI, PUFI_CONTRACT } from "@/app/services/contracts";

export async function getTokenMetadata(): Promise<{
  name: string;
  symbol: string;
  decimals: number;
}> {
    const contractAddress = PUFI_CONTRACT as `0x${string}`;

if (!PUFI_CONTRACT) {
  throw new Error("PUFI contract address is not configured.");
}
  const [name, symbol, decimals] = await Promise.all([
    publicClient.readContract({
      address: contractAddress,
      abi: ERC20_ABI,
      functionName: "name",
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: ERC20_ABI,
      functionName: "symbol",
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: ERC20_ABI,
      functionName: "decimals",
    }),
  ]);

  return {
    name: String(name),
    symbol: String(symbol),
    decimals: Number(decimals),
  };
}
