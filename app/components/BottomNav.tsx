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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[#0B101B]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[720px] items-center justify-between px-2">
        {navItems.map((item) => {
          const isActive = active === item.key;

          return (
            <button
              key={item.key}
              onClick={() => router.push(item.href)}
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
                ${
                  isActive
                    ? "text-[#FFC857]"
                    : "text-slate-500 hover:text-slate-300"
                }
              `}
            >
              <span className="text-xl leading-none">
                {item.icon}
              </span>

              <span className="text-[9px] font-black uppercase tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}