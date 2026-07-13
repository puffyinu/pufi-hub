"use client";

import React from "react";

export default function BottomNav() {
  const navItems = [
    { label: "Campaign", icon: "📢", active: false },
    { label: "Claim", icon: "🎁", active: false },
    { label: "Dashboard", icon: "🏠", active: true },
    { label: "Wallet", icon: "👛", active: false },
    { label: "Creator", icon: "🛠", active: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[#0B101B]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[720px] items-center justify-between px-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`
              flex 
              flex-1 
              min-h-[44px]
              flex-col 
              items-center 
              justify-center 
              gap-1 
              py-2
              transition-all 
              active:scale-90
              ${item.active ? "text-[#FFC857]" : "text-slate-500 hover:text-slate-300"}
            `}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="text-[9px] font-black uppercase tracking-tight">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}