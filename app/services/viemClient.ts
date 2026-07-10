import { createPublicClient, http } from "viem";
import { worldchain } from "viem/chains";

const rpcUrl =
  process.env.NEXT_PUBLIC_RPC_URL ??
  "http://localhost:8545";

export const publicClient = createPublicClient({
  chain: worldchain,
  transport: http(rpcUrl),
});