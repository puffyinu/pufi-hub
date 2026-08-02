import { createWalletClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { worldchain } from "viem/chains";
import { publicClient } from "@/app/services/viemClient";
import { PUFI_CONTRACT, ERC20_ABI } from "@/app/services/contracts";

// SERVER-SIDE ONLY. Never import in client components.
const privateKey = process.env.REWARD_WALLET_PRIVATE_KEY as `0x${string}`;
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL!;

function getRewardAccount() {
  if (!privateKey) {
    throw new Error("REWARD_WALLET_PRIVATE_KEY is not configured.");
  }
  return privateKeyToAccount(privateKey);
}

function getWalletClient() {
  return createWalletClient({
    account: getRewardAccount(),
    chain: worldchain,
    transport: http(rpcUrl),
  });
}

export function getRewardWalletAddress(): string {
  return getRewardAccount().address;
}

export async function sendPufiFromRewardWallet(
  toAddress: string,
  amount: number
): Promise<{ txHash: string }> {
  const walletClient = getWalletClient();
  const amountInWei = parseUnits(amount.toString(), 18);

  const txHash = await walletClient.writeContract({
    address: PUFI_CONTRACT as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "transfer",
    args: [toAddress as `0x${string}`, amountInWei],
  });

  // Wait for confirmation to ensure it actually succeeded on-chain
  await publicClient.waitForTransactionReceipt({ hash: txHash });

  return { txHash };
}
