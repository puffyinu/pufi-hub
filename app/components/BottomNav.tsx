"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { MiniKit } from "@worldcoin/minikit-js";

export type NavKey =
  | "campaign"
  | "claim"
  | "dashboard"
  | "wallet"
  | "creator";

interface BottomNavProps {
  active?: NavKey;
}

export default function BottomNav({ active }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

  const HOLDSTATION_URL =
    "https://worldcoin.org/mini-app?app_id=app_0d4b759921490adc1f2bd569fda9b53a&app_mode=mini-app";

  // Penentuan tab aktif berdasarkan prop atau lokasi URL
  const getActiveTab = (): NavKey => {
    if (active) return active;
    if (pathname.startsWith("/campaign")) return "campaign";
    if (pathname.startsWith("/claim")) return "claim";
    if (pathname.startsWith("/creator")) return "creator";
    if (pathname.startsWith("/dashboard")) return "dashboard";
    return "dashboard";
  };

  const currentActive = getActiveTab();

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

  const handleNavigation = (item: (typeof navItems)[0]) => {
    if (item.key === "wallet") {
      // Mengutamakan penanganan via MiniKit atau fallback lokasi aman WebView
      if (typeof window !== "undefined") {
        if (MiniKit.isInstalled()) {
          window.location.href = HOLDSTATION_URL;
        } else {
          window.open(HOLDSTATION_URL, "_blank", "noopener,noreferrer");
        }
      }
      return;
    }

    if (pathname !== item.href) {
      router.push(item.href);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800/80 bg-[#0B101B]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl select-none">
      <div className="mx-auto flex h-16 max-w-md items-center justify-between px-2">
        {navItems.map((item) => {
          const isActive = currentActive === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleNavigation(item)}
              aria-label={item.label}
              className={`
                relative
                flex
                min-h-[44px]
                min-w-[44px]
                flex-1
                flex-col
                items-center
                justify-center
                gap-1
                py-1
                px-1
                touch-manipulation
                transition-transform
                duration-150
                active:scale-95
                ${
                  isActive
                    ? "text-[#FFC857]"
                    : "text-slate-400 hover:text-slate-200"
                }
              `}
            >
              {/* Active Indicator Top Glow */}
              {isActive && (
                <div className="absolute top-0 h-0.5 w-8 rounded-full bg-[#FFC857] shadow-[0_0_8px_#FFC857]" />
              )}

              {/* Icon Wrapper */}
              <div
                className={`relative h-6 w-6 transition-all duration-200 ${
                  isActive
                    ? "scale-110 brightness-110"
                    : "opacity-60 brightness-90"
                }`}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={24}
                  height={24}
                  className="object-contain"
                  priority={isActive}
                />
              </div>

              {/* Text Label */}
              <span
                className={`text-[9px] font-bold uppercase tracking-wider transition-opacity duration-200 ${
                  isActive ? "opacity-100" : "opacity-60"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}