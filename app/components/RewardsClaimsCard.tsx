"use client";

const rewards = [
  {
    token: "PUFI",
    amount: "10 PUFI",
    icon: "🟣",
  },
  {
    token: "USDC",
    amount: "2.50 USDC",
    icon: "💵",
  },
  {
    token: "WLD",
    amount: "0.15 WLD",
    icon: "🌐",
  },
];

export default function RewardsClaimsCard() {
  return (
    <section>
      <h2 className="mb-1.5 text-[7.5px] font-black uppercase tracking-[0.4em] text-slate-500">
        🎁 Rewards Claims
      </h2>

      <div className="flex gap-2">
        {rewards.map((reward) => (
          <div
            key={reward.token}
            className="flex flex-1 flex-col items-center rounded-[16px] border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl transition-all hover:bg-white/10"
          >
            <div className="mb-0.5 text-lg">
              {reward.icon}
            </div>

            <div className="text-[7.5px] font-black tracking-widest text-white uppercase">
              {reward.token}
            </div>

            <div className="mt-0.5 mb-2 text-[8px] font-bold text-slate-400">
              {reward.amount}
            </div>

            <button className="w-full rounded-lg bg-gradient-to-b from-[#FFE580] via-[#FFC857] to-[#E59400] py-0.5 text-[6.5px] font-black uppercase tracking-widest text-[#171717] shadow-lg transition-all active:scale-95 hover:brightness-110">
              CLAIM
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
