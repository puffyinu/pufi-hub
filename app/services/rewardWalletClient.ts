import { createWalletClient, http, isAddress, parseUnits, type Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { worldchain } from "viem/chains";
import { publicClient } from "@/app/services/viemClient";
import { PUFI_CONTRACT, ERC20_ABI } from "@/app/services/contracts";

// SERVER-SIDE ONLY. Never import in client components.
const privateKey = process.env.REWARD_WALLET_PRIVATE_KEY as `0x${string}`;
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL!;

export type RewardWalletPreflightErrorCode =
  | "INVALID_REWARD_WALLET"
  | "INVALID_PUFI_CONTRACT"
  | "INVALID_TOKEN_DECIMALS"
  | "REWARD_WALLET_NO_GAS"
  | "INSUFFICIENT_PUFI_BALANCE"
  | "INVALID_RECIPIENT_ADDRESS"
  | "TRANSFER_PREFLIGHT_FAILED";

export type RewardWalletPreflightResult =
  | {
      success: true;
      amountInBaseUnits: bigint;
    }
  | {
      success: false;
      code: RewardWalletPreflightErrorCode;
      error: string;
    };

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

export async function validateRewardWalletTransfer(
  toAddress: string,
  amount: number
): Promise<RewardWalletPreflightResult> {
  if (!isAddress(toAddress)) {
    return {
      success: false,
      code: "INVALID_RECIPIENT_ADDRESS",
      error: "The recipient wallet address is invalid.",
    };
  }

  let rewardAccount: ReturnType<typeof getRewardAccount>;
  try {
    rewardAccount = getRewardAccount();
  } catch {
    return {
      success: false,
      code: "INVALID_REWARD_WALLET",
      error: "The reward wallet is not configured correctly.",
    };
  }

  if (!isAddress(PUFI_CONTRACT)) {
    return {
      success: false,
      code: "INVALID_PUFI_CONTRACT",
      error: "The PUFI token contract is not configured correctly.",
    };
  }

  const contractAddress = PUFI_CONTRACT as Address;

  try {
    const contractCode = await publicClient.getCode({ address: contractAddress });
    if (!contractCode || contractCode === "0x") {
      return {
        success: false,
        code: "INVALID_PUFI_CONTRACT",
        error: "The configured PUFI token contract is not deployed.",
      };
    }

    const [nativeBalance, tokenDecimals] = await Promise.all([
      publicClient.getBalance({ address: rewardAccount.address }),
      publicClient.readContract({
        address: contractAddress,
        abi: ERC20_ABI,
        functionName: "decimals",
      }),
    ]);

    const decimals = Number(tokenDecimals);
    if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255) {
      return {
        success: false,
        code: "INVALID_TOKEN_DECIMALS",
        error: "The PUFI token returned invalid decimals.",
      };
    }

    if (nativeBalance === BigInt(0)) {
      return {
        success: false,
        code: "REWARD_WALLET_NO_GAS",
        error: "The reward wallet has no native World Chain balance for gas.",
      };
    }

    const amountInBaseUnits = parseUnits(amount.toString(), decimals);
    const tokenBalance = await publicClient.readContract({
      address: contractAddress,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [rewardAccount.address],
    });

    if (tokenBalance < amountInBaseUnits) {
      return {
        success: false,
        code: "INSUFFICIENT_PUFI_BALANCE",
        error: "The reward wallet does not have enough PUFI for this claim.",
      };
    }

    const [estimatedGas, gasPrice] = await Promise.all([
      publicClient.estimateContractGas({
        account: rewardAccount.address,
        address: contractAddress,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [toAddress as Address, amountInBaseUnits],
      }),
      publicClient.getGasPrice(),
    ]);

    if (nativeBalance < estimatedGas * gasPrice) {
      return {
        success: false,
        code: "REWARD_WALLET_NO_GAS",
        error: "The reward wallet does not have enough native World Chain balance for gas.",
      };
    }

    return { success: true, amountInBaseUnits };
  } catch (error) {
    console.error("[REWARD_WALLET] Preflight failed", error);
    return {
      success: false,
      code: "TRANSFER_PREFLIGHT_FAILED",
      error: "Reward-wallet transfer validation failed.",
    };
  }
}

export async function sendPufiFromRewardWallet(
  toAddress: string,
  amountInBaseUnits: bigint
): Promise<{ txHash: string }> {
  const walletClient = getWalletClient();

  const txHash = await walletClient.writeContract({
    address: PUFI_CONTRACT as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "transfer",
    args: [toAddress as `0x${string}`, amountInBaseUnits],
  });

  // Wait for confirmation to ensure it actually succeeded on-chain
  await publicClient.waitForTransactionReceipt({ hash: txHash });

  return { txHash };
}
