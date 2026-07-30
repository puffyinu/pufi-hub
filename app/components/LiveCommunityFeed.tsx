"use client";

import { useLanguage } from "@/app/context/LanguageContext";

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
  const { t } = useLanguage();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3 px-2">
        <h3 className="text-[#FFC857]/50 text-[10px] font-black uppercase tracking-widest">
          {t("community_stream")}
        </h3>

        <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2 py-1 border border-emerald-500/20">
          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none">
            {t("live")}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-2 border border-white/10 shadow-xl">
        {MOCK_DATA.map((item) => (
          <div
            key={`${item.text}-${item.time}`}
            className="flex items-center justify-between hover:bg-white/5 transition-colors rounded-2xl px-4 py-3 min-h-[48px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm shrink-0">
                {item.icon}
              </div>

              <p className="text-slate-200 text-xs font-bold tracking-tight line-clamp-1">
                {item.text}
              </p>
            </div>

            <span className="shrink-0 text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}