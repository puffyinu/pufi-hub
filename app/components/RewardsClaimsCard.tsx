"use client";

import { useState } from "react";
import { useRewardQueue } from "@/app/hooks/useRewardQueue";
import { claimReward } from "@/app/services/rewardClaimEngine";
import UIFeedback from "./UIFeedback";

export default function RewardsClaimsCard() {
  const { rewards } = useRewardQueue();
  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    type: "alert" | "confirm";
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    type: "alert",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const handleClaim = async (rewardId: string) => {
    const result = await claimReward(rewardId);
    if (result.success) {
      setFeedback({
        isOpen: true,
        type: "alert",
        title: "Claim Successful",
        message: `Reward claimed! TX: ${result.txHash?.slice(0, 10)}...`,
        onConfirm: () => setFeedback(f => ({ ...f, isOpen: false })),
      });
    } else {
      setFeedback({
        isOpen: true,
        type: "alert",
        title: "Claim Failed",
        message: result.error || "Transaction failed.",
        onConfirm: () => setFeedback(f => ({ ...f, isOpen: false })),
      });
    }
  };

  const formatAmount = (val: number) => {
    const rounded = Math.round(val * 1e6) / 1e6;
    return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(3);
  };

  return (
    <section>
      <h2 className="mb-3 text-[7.5px] font-black uppercase tracking-[0.4em] text-slate-500">
        🎁 Reward Queue
      </h2>

      <div className="space-y-3">
        {rewards.length === 0 && (
           <div className="py-6 text-center border border-dashed border-white/10 rounded-2xl bg-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">No pending rewards</div>
        )}
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className="flex items-center justify-between rounded-[16px] border border-white/10 bg-white/5 p-3 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="text-xl">💰</div>
              <div>
                <div className="text-[11px] font-black text-white">
                  {formatAmount(reward.amount)} {reward.token}
                </div>
                <div className="text-[8px] font-black tracking-widest text-slate-400 uppercase">
                  {reward.status}
                </div>
              </div>
            </div>

            <button 
              disabled={reward.status !== "READY"}
              onClick={() => handleClaim(reward.id)}
              className={`rounded-lg px-4 py-1.5 text-[8px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 ${
                reward.status === "READY"
                ? "bg-gradient-to-b from-[#FFE580] via-[#FFC857] to-[#E59400] text-[#171717]" 
                : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              {reward.status === "CLAIMING" ? "..." : reward.status === "READY" ? "CLAIM" : reward.status}
            </button>
          </div>
        ))}
      </div>

      <UIFeedback
        isOpen={feedback.isOpen}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onConfirm={feedback.onConfirm}
      />
    </section>
  );
}
