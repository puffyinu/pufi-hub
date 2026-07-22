"use client";

import { useRouter } from "next/navigation";

type NavKey =
  | "campaign"
  | "claim"
  | "dashboard"
  | "wallet"
  | "creator";

interface BottomNavProps {
  active?: NavKey;
}

export default function BottomNav({
  active = "dashboard",
}: BottomNavProps) {
  const router = useRouter();

  const navItems = [
    {
      key: "campaign" as NavKey,
      label: "Campaign",
      icon: "📢",
      href: "/campaign",
    },
    {
      key: "claim" as NavKey,
      label: "Claim",
      icon: "🎁",
      href: "/claim",
    },
    {
      key: "dashboard" as NavKey,
      label: "Dashboard",
      icon: "🏠",
      href: "/dashboard",
    },
    {
      key: "wallet" as NavKey,
      label: "Wallet",
      icon: "👛",
      href: "/wallet",
    },
    {
      key: "creator" as NavKey,
      label: "Creator",
      icon: "🛠",
      href: "/creator",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[#0B101B]/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-[600px] items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = active === item.key;

          return (
            <button
              key={item.key}
              onClick={() => router.push(item.href)}
              className={`
                relative
                flex
                flex-col
                items-center
                justify-center
                gap-1.5
                px-2
                transition-all
                active:scale-90
                ${
                  isActive
                    ? "text-[#FFC857]"
                    : "text-slate-500 hover:text-slate-300"
                }
              `}
            >
              {isActive && (
                <div className="absolute -top-3 h-1 w-6 rounded-full bg-[#FFC857] blur-[2px]" />
              )}

              <span className={`text-xl leading-none transition-transform ${isActive ? "scale-110 -translate-y-0.5" : ""}`}>
                {item.icon}
              </span>

              <span className={`text-[8px] font-black uppercase tracking-[0.1em] ${isActive ? "opacity-100" : "opacity-60"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}