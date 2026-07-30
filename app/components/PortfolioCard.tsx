"use client";

import { useState } from "react";
import { useWalletBalance } from "@/app/hooks/useWalletBalance";
import { useLanguage } from "@/app/context/LanguageContext";
import { MiniKit } from "@worldcoin/minikit-js";

export default function PortfolioCard() {
  const { balance } = useWalletBalance();
  const { t } = useLanguage();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const formattedPufi = parseFloat(balance.pufi).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const handleSwap = () => {
    const HOLDSTATION_URL = "https://worldcoin.org/mini-app?app_id=app_0d4b759921490adc1f2bd569fda9b53a&app_mode=mini-app";
    if (typeof window !== "undefined") {
      if (MiniKit.isInstalled()) {
        window.location.assign(HOLDSTATION_URL);
      } else {
        window.open(HOLDSTATION_URL, "_blank", "noopener,noreferrer");
      }
    }
  };

  return (
    <>
      <section className="w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-2xl text-center">
        <h2 className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase mb-4">
          {t("available_balance")}
        </h2>

        <div className="mb-6 flex items-baseline justify-center gap-1.5">
          <span className="text-5xl font-black tracking-tighter text-white">
            {formattedPufi}
          </span>
          <span className="text-sm font-black text-[#FFC857] uppercase tracking-widest">
            PUFI
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSwap}
            className="flex-1 min-h-[48px] rounded-2xl bg-white/5 py-3 text-xs font-black uppercase tracking-widest text-white transition-transform hover:bg-white/10 active:scale-95 border border-white/10 shadow-lg touch-manipulation"
          >
            {t("swap")}
          </button>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex-1 min-h-[48px] rounded-2xl bg-gradient-to-b from-[#FFE580] via-[#FFC857] to-[#E59400] py-3 text-xs font-black uppercase tracking-widest text-[#171717] shadow-[0_4px_15px_rgba(255,200,87,0.2)] transition-transform active:scale-95 hover:brightness-110 touch-manipulation"
          >
            {t("invite")}
          </button>
        </div>
      </section>

      {isInviteModalOpen && (
        <InviteModal onClose={() => setIsInviteModalOpen(false)} />
      )}
    </>
  );
}

function InviteModal({ onClose }: { onClose: () => void }) {
  const inviteCode = "PUFI-6969";
  const inviteLink = `https://pufi.hub/invite/${inviteCode}`;
  const { t } = useLanguage();
  const [codeCopyStatus, setCodeCopyStatus] = useState(t("copy"));
  const [linkCopyStatus, setLinkCopyStatus] = useState(t("copy"));

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCodeCopyStatus(t("copied"));
    setTimeout(() => setCodeCopyStatus(t("copy")), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopyStatus(t("copied"));
    setTimeout(() => setLinkCopyStatus(t("copy")), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join PUFI HUB",
          text: `Use my invite code ${inviteCode} to join PUFI HUB!`,
          url: inviteLink,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 backdrop-blur-md px-4 select-none">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-b from-[#1E2036] to-[#0D1125] p-6 ring-1 ring-white/10 shadow-2xl">
        <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[60px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight">{t("invite_friends")}</h2>
          
          <div className="w-full mb-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">
              {t("your_invite_code")}
            </p>
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3 border border-white/10">
              <span className="text-lg font-mono font-bold text-yellow-400 tracking-wider">{inviteCode}</span>
              <button
                onClick={handleCopyCode}
                className="min-w-[60px] min-h-[36px] text-[10px] font-black uppercase text-white bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all active:scale-95 touch-manipulation"
              >
                {codeCopyStatus === t("copied") ? "✅" : t("copy")}
              </button>
            </div>
          </div>

          <div className="w-full mb-8">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">
              {t("invite_link")}
            </p>
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3 border border-white/10 gap-3">
              <p className="text-xs text-slate-300 truncate font-medium flex-1">
                {inviteLink}
              </p>
              <button
                onClick={handleCopyLink}
                className="min-w-[60px] min-h-[36px] shrink-0 text-[10px] font-black uppercase text-white bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all active:scale-95 touch-manipulation"
              >
                {linkCopyStatus === t("copied") ? "✅" : t("copy")}
              </button>
            </div>
          </div>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 min-h-[44px] rounded-xl bg-white/10 py-3 text-xs font-black uppercase tracking-widest text-white transition-transform hover:bg-white/20 active:scale-95 touch-manipulation"
            >
              {t("close")}
            </button>
            <button
              onClick={handleShare}
              className="flex-[2] min-h-[44px] rounded-xl bg-gradient-to-b from-[#FFE580] via-[#FFB323] to-[#E59400] py-3 text-xs font-black uppercase tracking-widest text-[#171717] shadow-lg transition-transform active:scale-95 hover:brightness-110 touch-manipulation"
            >
              {t("share_now")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}