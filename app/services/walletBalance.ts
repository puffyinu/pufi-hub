import { ethers } from "ethers";

import { provider } from "./provider";
import { PUFI_CONTRACT, ERC20_ABI } from "./contracts";

const contract = new ethers.Contract(
  PUFI_CONTRACT,
  ERC20_ABI,
  provider
);

export interface BalanceResult {
  wld: string;
  pufi: string;
}

export async function getWalletBalance(
  address?: string
): Promise<BalanceResult> {

  if (!address) {
    return {
      wld: "0.00",
      pufi: "0.00",
    };
  }

  const [wldBalance, pufiBalance, decimals] =
    await Promise.all([
      provider.getBalance(address),
      contract.balanceOf(address),
      contract.decimals(),
    ]);

  return {
    wld: Number(
      ethers.formatEther(wldBalance)
    ).toFixed(4),

    pufi: Number(
      ethers.formatUnits(
        pufiBalance,
        decimals
      )
    ).toFixed(4),
  };
}