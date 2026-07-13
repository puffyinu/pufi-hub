"use client";

import Image from "next/image";

export default function WelcomeCard() {
  const items = [
  {
    label: "Verification",
    value: "Human Verified",
    color: "text-[#34C759]",
    icon: "🛡️",
  },
  {
    label: "Wallet",
    value: "Connected",
    color: "text-[#FFC857]",
    icon: "👛",
  },
  {
    label: "Network",
    value: "World Chain",
    color: "text-blue-400",
    icon: "🌍",
  },
];

  const footerItems = [
  {
    label: "Member Since",
    value: "Jul 2026",
  },
  {
    label: "World ID",
    value: "********8F2A",
    mono: true,
  },
];

  return (
    <div className="bg-gradient-to-b from-[#1A1635]/90 to-[#0B101B]/95 backdrop-blur-3xl rounded-[48px] p-8 mx-4 mb-8 border border-purple-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden group">
      {/* Premium Polish: Top Shine */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />
      
      {/* Card Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFC857]/5 blur-3xl rounded-full -mr-16 -mt-16" />
      
      <div className="flex flex-col items-center text-center mb-8 relative z-10">
        {/* Mascot Avatar with Gold Circular Frame */}
        <div className="relative p-1.5 rounded-full bg-gradient-to-b from-[#FFC857] to-[#D9A321] shadow-[0_0_30px_rgba(255,200,87,0.3)] mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-[4px] border-[#1A1635] bg-white">
            <Image 
              src="/images/pufi-mascot.png" 
              alt="PUFI Mascot" 
              width={96} 
              height={96} 
              className="object-cover"
            />
          </div>
        </div>
        
        <div>
          <p className="text-[#FFC857] text-sm font-bold mb-2">
  Welcome Human 👋
</p>
          <h2 className="text-white text-5xl font-black tracking-tight drop-shadow-sm">
  CHOQYE
</h2>
        </div>
      </div>

      {/* Status Section */}
      <div className="space-y-3 mb-8">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-[13px] bg-white/[0.03] hover:bg-white/[0.06] transition-colors rounded-[24px] px-6 py-4 border border-white/5">
            <div className="flex items-center gap-3">
              <span className="opacity-80">{item.icon}</span>
              <span className="text-purple-200/50 font-bold uppercase tracking-widest text-[10px]">{item.label}</span>
            </div>
            <span className={`${item.color || 'text-white'} font-black tracking-tight`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Lower Section: Account Details */}
      <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
        {footerItems.map((item, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">
              {item.label}
            </span>
            <span className={`text-slate-300 text-[11px] font-bold ${item.mono ? 'font-mono opacity-60 truncate' : ''}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}