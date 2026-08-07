"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useReward } from "@/app/hooks/useReward";
import { useRewardClaim } from "@/app/hooks/useRewardClaim";
import UIFeedback from "./UIFeedback";

export default function RewardsClaimsCard() {
  const { reward } = useReward();
  const { rewardClaim, prepare, executeMock, reset } = useRewardClaim();
  const [alertOpen, setAlertOpen] = useState(false);
  const [successToken, setSuccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (rewardClaim.status === "claimed") {
      const token = rewardClaim.token;
      // Move state updates out of the synchronous effect body to avoid cascading renders
      const timer = setTimeout(() => {
        setSuccessToken(token);
        setAlertOpen(true);
        reset();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [rewardClaim.status, rewardClaim.token, reset]);

  const handleClaim = async (token: string, amount: number) => {
    // Step 1: Prepare the claim
    prepare(token, amount);

    // Step 2: Execute mock claim logic
    // This simulates the transaction process without actual blockchain interaction
    try {
      await executeMock(token, amount);
    } catch (error) {
      console.error("Claim execution failed", error);
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
        {rewardItems.map((item) => {
          const isClaimingThis = rewardClaim.status === "claiming" && rewardClaim.token === item.token;
          const isLoading = rewardClaim.loading && isClaimingThis;

          return (
            <div
              key={item.token}
              className="flex flex-1 flex-col items-center rounded-[16px] border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl transition-all hover:bg-white/10"
            >
              <div className="mb-0.5 relative h-6 w-6 flex items-center justify-center">
                {item.icon.startsWith("/") ? (
                  <Image 
                    src={item.icon} 
                    alt={item.token} 
                    fill 
                    className="object-contain" 
                  />
                ) : (
                  <span className="text-xl">{item.icon}</span>
                )}
              </div>

              <div className="text-[11px] font-black text-white mb-0.5">
                {formatAmount(item.amount)}
              </div>

              <div className="mb-2 text-[8px] font-black tracking-widest text-slate-400 uppercase">
                {item.token}
              </div>

              <button 
                disabled={item.amount === 0 || rewardClaim.loading}
                onClick={() => handleClaim(item.token, item.amount)}
                className={`w-full rounded-lg py-1 text-[7px] font-black uppercase tracking-widest text-[#171717] shadow-lg transition-all active:scale-95 hover:brightness-110 ${
                  item.amount > 0 && !rewardClaim.loading
                  ? "bg-gradient-to-b from-[#FFE580] via-[#FFC857] to-[#E59400]" 
                  : "bg-white/10 text-white/30 cursor-not-allowed"
                }`}
              >
                {isLoading ? "..." : "CLAIM"}
              </button>
            </div>
          );
        })}
      </div>

      {rewardClaim.status === "failed" && rewardClaim.error && (
        <UIFeedback
          isOpen={true}
          type="alert"
          title="Claim Error"
          message={rewardClaim.error}
          onConfirm={() => reset()}
        />
      )}

      <UIFeedback
        isOpen={alertOpen}
        type="alert"
        title="Claim Successful"
        message={`${successToken} reward has been claimed! (Foundation Mock Flow)`}
        onConfirm={() => {
          setAlertOpen(false);
          setSuccessToken(null);
        }}
      />
    </section>
  );
}
