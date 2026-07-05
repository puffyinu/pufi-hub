import { createPublicClient, http } from "viem";
import { worldchain } from "viem/chains";

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

if (!rpcUrl) {
  throw new Error("NEXT_PUBLIC_RPC_URL is not configured.");
}

export const publicClient = createPublicClient({
  chain: worldchain,
  transport: http(rpcUrl),
});