"use client";

const MOCK_DATA = [
  {
    icon: "🪙",
    text: "@A**** claimed 1 PUFI",
    time: "2m ago",
  },
  {
    icon: "💵",
    text: "@B**** claimed 0.002 WLD",
    time: "5m ago",
  },
  {
    icon: "📢",
    text: "@C**** completed Campaign",
    time: "12m ago",
  },
];

export default function LiveCommunityFeed() {
  return (
    <div className="mx-4 mb-5">
      <div className="flex justify-between items-center mb-3 px-2">
        <h3 className="text-[#FFC857]/40 text-[9px] font-black uppercase tracking-[0.4em]">
          Community Stream
        </h3>

        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">
            Live
          </span>

          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      <div className="bg-[#1A1635]/30 backdrop-blur-md rounded-[28px] p-1.5 border border-white/5">
        {MOCK_DATA.map((item) => (
          <div
            key={`${item.text}-${item.time}`}
            className="flex items-center justify-between hover:bg-white/[0.02] transition-colors rounded-[22px] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-sm">
                {item.icon}
              </div>

              <p className="text-slate-300 text-[12px] font-bold tracking-tight">
                {item.text}
              </p>
            </div>

            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}