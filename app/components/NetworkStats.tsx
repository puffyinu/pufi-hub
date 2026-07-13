"use client";

const STATS = [
  { label: "Active Campaign", value: "12", icon: "🚀" },
  { label: "Active Users", value: "14.2k", icon: "👥" },
  { label: "Claims Today", value: "842", icon: "💎" },
  { label: "Rewards Dist.", value: "1.2M", icon: "💰" },
];

export default function NetworkStats() {
  return (
    <div className="mx-4 mb-28">
      <h3 className="text-[#FFC857]/60 text-[10px] font-black uppercase tracking-[0.3em] mb-4 px-2">Network Stats</h3>
      <div className="grid grid-cols-2 gap-3">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-gradient-to-br from-[#1A1635]/60 to-[#0B101B]/80 rounded-[32px] p-6 border border-purple-500/10 shadow-xl">
            <div className="flex flex-col items-start gap-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#FFC857]/5 text-[#FFC857] text-2xl border border-[#FFC857]/10 shadow-[inset_0_0_12px_rgba(255,200,87,0.05)]">
                {stat.icon}
              </div>
              <div>
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.15em] mb-1">
                  {stat.label}
                </p>
                <p className="text-white text-xl font-black tracking-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}