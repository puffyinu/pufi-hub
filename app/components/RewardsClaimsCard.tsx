"use client";

import { useReward } from "@/app/hooks/useReward";
import { prepareRewardClaim } from "@/app/services/rewardClaimEngine";

export default function RewardsClaimsCard() {
  const { reward } = useReward();
  const pending = reward.pending;

  const handleClaim = () => {
    const success = prepareRewardClaim();
    if (success) {
      alert("Claim prepared! Proceeding to wallet transfer (Build #008)...");
    }
  };

  const rewardItems = [
    {
      token: "PUFI",
      icon: "🟣",
      amount: pending || 0,
    },
    {
      token: "USDC",
      icon: "💵",
      amount: 0,
    },
    {
      token: "WLD",
      icon: "🌐",
      amount: 0,
    },
  ];

  return (
    <section>
      <h2 className="mb-1.5 text-[7.5px] font-black uppercase tracking-[0.4em] text-slate-500">
        🎁 Rewards Claims
      </h2>

      <div className="flex gap-2">
        {rewardItems.map((reward) => (
          <div
            key={reward.token}
            className="flex flex-1 flex-col items-center rounded-[16px] border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl transition-all hover:bg-white/10"
          >
            <div className="mb-0.5 text-lg">
              {reward.icon}
            </div>

            <div className="text-[10px] font-black text-white mb-0.5">
              {reward.amount}
            </div>

            <div className="mb-2 text-[7.5px] font-black tracking-widest text-slate-400 uppercase">
              {reward.token}
            </div>

            <button 
              disabled={reward.amount === 0}
              onClick={handleClaim}
              className={`w-full rounded-lg py-0.5 text-[6.5px] font-black uppercase tracking-widest text-[#171717] shadow-lg transition-all active:scale-95 hover:brightness-110 ${
                reward.amount > 0 
                ? "bg-gradient-to-b from-[#FFE580] via-[#FFC857] to-[#E59400]" 
                : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              CLAIM
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
