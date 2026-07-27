"use client";

import { useState } from "react";
import Image from "next/image";
import { useReward } from "@/app/hooks/useReward";
import { useTransaction } from "@/app/hooks/useTransaction";
import { prepareRewardClaim } from "@/app/services/rewardClaimEngine";
import UIFeedback from "./UIFeedback";
import { encodeFunctionData } from "viem";

export default function RewardsClaimsCard() {
  const { reward } = useReward();
  const { send, loading: transactionLoading, transaction } = useTransaction();
  const [alertOpen, setAlertOpen] = useState(false);

  const handleClaim = async (token: string, amount: number) => {
    const success = prepareRewardClaim();
    if (!success) return;

    try {
      // BUILD-007.4: Integration with World MiniKit Transaction
      // This is the "Future Withdraw entry point"
      // We use a placeholder for the contract call to transfer reward to wallet
      await send({
        transactions: [
          {
            to: "0x0000000000000000000000000000000000000000",
            data: encodeFunctionData({
              abi: [
                {
                  name: "withdrawReward",
                  type: "function",
                  stateMutability: "nonpayable",
                  inputs: [
                    { name: "token", type: "string" },
                    { name: "amount", type: "uint256" },
                  ],
                  outputs: [],
                },
              ],
              functionName: "withdrawReward",
              args: [token, BigInt(Math.floor(amount * 1e6))], // Simplified decimals handling
            }),
          },
        ],
        chainId: 480, // World Chain Mainnet
      });

      setAlertOpen(true);
    } catch (error) {
      console.error("Withdrawal failed", error);
    }
  };

  const formatAmount = (val: number) => {
    // Round to 6 decimals to remove floating point errors before formatting
    const rounded = Math.round(val * 1e6) / 1e6;
    if (Number.isInteger(rounded)) {
      return rounded.toString();
    }
    // For non-integers, use 3 decimals
    return rounded.toFixed(3);
  };

  const rewardItems = [
    {
      token: "PUFI",
      icon: "/images/brand/pufi-coin.png",
      amount: reward.pendingByToken?.["PUFI"] || 0,
    },
    {
      token: "USDC",
      icon: "/images/iconusd/iconusd.png",
      amount: reward.pendingByToken?.["USDC"] || 0,
    },
    {
      token: "WLD",
      icon: "/images/iconwld/iconwld.png",
      amount: reward.pendingByToken?.["WLD"] || 0,
    },
  ];

  return (
    <section>
      <h2 className="mb-1.5 text-[7.5px] font-black uppercase tracking-[0.4em] text-slate-500">
        🎁 Rewards Claims
      </h2>

      <div className="flex gap-2">
        {rewardItems.map((item) => (
          <div
            key={item.token}
            className="flex flex-1 flex-col items-center rounded-[16px] border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl transition-all hover:bg-white/10"
          >
            <div className="mb-0.5 relative h-5 w-5 flex items-center justify-center">
              {item.icon.startsWith("/") ? (
                <Image 
                  src={item.icon} 
                  alt={item.token} 
                  fill 
                  className="object-contain" 
                />
              ) : (
                <span className="text-lg">{item.icon}</span>
              )}
            </div>

            <div className="text-[10px] font-black text-white mb-0.5">
              {formatAmount(item.amount)}
            </div>

            <div className="mb-2 text-[7.5px] font-black tracking-widest text-slate-400 uppercase">
              {item.token}
            </div>

            <button 
              disabled={item.amount === 0 || transactionLoading}
              onClick={() => handleClaim(item.token, item.amount)}
              className={`w-full rounded-lg py-0.5 text-[6.5px] font-black uppercase tracking-widest text-[#171717] shadow-lg transition-all active:scale-95 hover:brightness-110 ${
                item.amount > 0 && !transactionLoading
                ? "bg-gradient-to-b from-[#FFE580] via-[#FFC857] to-[#E59400]" 
                : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              {transactionLoading ? "..." : "CLAIM"}
            </button>
          </div>
        ))}
      </div>

      {transaction.error && (
        <UIFeedback
          isOpen={true}
          type="alert"
          title="Transaction Error"
          message={transaction.error}
          onConfirm={() => {}}
        />
      )}

      <UIFeedback
        isOpen={alertOpen}
        type="alert"
        title="Claim Prepared"
        message="Claim processed via World MiniKit! Reward is being transferred to your wallet."
        onConfirm={() => setAlertOpen(false)}
      />
    </section>
  );
}
