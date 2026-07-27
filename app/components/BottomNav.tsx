"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";

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
  const { t } = useLanguage();
  const HOLDSTATION_URL = "https://worldcoin.org/mini-app?app_id=app_0d4b759921490adc1f2bd569fda9b53a&app_mode=mini-app";

  const navItems = [
    {
      key: "campaign" as NavKey,
      label: t("campaign"),
      icon: "/icons/navigation/campaign.png",
      href: "/campaign",
    },
    {
      key: "claim" as NavKey,
      label: t("claim"),
      icon: "/icons/navigation/dailyclaim.png",
      href: "/claim",
    },
    {
      key: "dashboard" as NavKey,
      label: t("dashboard"),
      icon: "/icons/navigation/dashboard.png",
      href: "/dashboard",
    },
    {
      key: "wallet" as NavKey,
      label: t("wallet"),
      icon: "/icons/navigation/wallet.png",
      href: "#",
    },
    {
      key: "creator" as NavKey,
      label: t("creator"),
      icon: "/icons/navigation/creator.png",
      href: "/creator",
    },
  ];

  const handleNavigation = (item: typeof navItems[0]) => {
    if (item.key === "wallet") {
      window.open(HOLDSTATION_URL, "_blank");
      return;
    }
    router.push(item.href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[#0B101B]/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-[600px] items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = active === item.key;

          return (
            <button
              key={item.key}
              onClick={() => handleNavigation(item)}
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

              <div className={`relative h-9 w-9 transition-all duration-300 ${isActive ? "scale-110 -translate-y-0.5" : "opacity-70 brightness-75 scale-[0.98]"}`}>
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={36}
                  height={36}
                  className="object-contain"
                  priority={isActive}
                />
              </div>

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