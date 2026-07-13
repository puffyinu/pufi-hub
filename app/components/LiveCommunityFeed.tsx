"use client";

const MOCK_DATA = [
  { text: "@A**** claimed 1 PUFI", time: "2m ago" },
  { text: "@B**** claimed 0.002 WLD", time: "5m ago" },
  { text: "@C**** completed Campaign", time: "12m ago" },
];

export default function LiveCommunityFeed() {
  return (
    <div className="mx-4 mb-8">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-[#FFC857]/60 text-[10px] font-black uppercase tracking-[0.3em]">Live Feed</h3>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>
      <div className="bg-[#1A1635]/40 backdrop-blur-sm rounded-[32px] p-2 border border-purple-500/10 space-y-1">
        {MOCK_DATA.map((item, i) => (
          <div key={i} className="flex items-center justify-between bg-white/[0.01] hover:bg-white/[0.04] transition-colors rounded-[24px] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FFC857]/40" />
              <p className="text-slate-300 text-[13px] font-medium tracking-tight">{item.text}</p>
            </div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}