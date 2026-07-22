"use client";

const STATS = [
  {
    label: "Campaigns Joined",
    value: "0",
    icon: "🎯",
  },
  {
    label: "Claims",
    value: "0",
    icon: "🎁",
  },
  {
    label: "Total Rewards",
    value: "0 PUFI",
    icon: "💰",
  },
  {
    label: "Activity Log",
    value: "0",
    icon: "📈",
  },
];

export default function NetworkStats() {
  return (
    <div className="mx-4 mb-4">
      <h3 className="text-[#FFC857]/40 text-[9px] font-black uppercase tracking-[0.4em] mb-3 px-2">
        Performance Hub
      </h3>

      <div className="grid grid-cols-2 gap-2.5">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#1A1635]/40 backdrop-blur-xl rounded-[24px] p-5 border border-white/5 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
               <span className="text-3xl grayscale">{stat.icon}</span>
            </div>

            <div className="flex flex-col items-start justify-between min-h-[80px]">
              <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#FFC857]/10 text-[#FFC857] text-lg border border-[#FFC857]/20">
                {stat.icon}
              </div>

              <div className="mt-4">
                <p className="text-slate-500 text-[8px] font-black uppercase tracking-[0.2em] mb-0.5">
                  {stat.label}
                </p>

                <p className="text-white text-lg font-black tracking-tighter">
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