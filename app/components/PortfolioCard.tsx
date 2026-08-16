"use client";

import { useEffect, useRef, useState } from "react";
import { useWalletBalance } from "@/app/hooks/useWalletBalance";
import { useLanguage } from "@/app/context/LanguageContext";
import { MiniKit } from "@worldcoin/minikit-js";

export default function PortfolioCard() {
  const { balance, isInitialLoading } = useWalletBalance();
  const { t } = useLanguage();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const inviteButtonRef = useRef<HTMLButtonElement>(null);
  const formattedPufi = parseFloat(balance.pufi).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const handleSwap = () => {
    const url = "https://worldcoin.org/mini-app?app_id=app_0d4b759921490adc1f2bd569fda9b53a&app_mode=mini-app";
    if (MiniKit.isInstalled()) window.location.assign(url);
    else window.open(url, "_blank", "noopener,noreferrer");
  };

  return <>
    <section className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-2xl backdrop-blur-2xl">
      <h2 className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">{t("available_balance")}</h2>
      <div className="mb-6 flex items-baseline justify-center gap-1.5">
        {isInitialLoading ? <div className="my-1 h-[48px] w-32 animate-pulse rounded-xl bg-white/10" /> : <span className="text-5xl font-black tracking-tighter text-white">{formattedPufi}</span>}
        <span className="text-sm font-black uppercase tracking-widest text-[#FFC857]">PUFI</span>
      </div>
      <div className="flex gap-3">
        <button onClick={handleSwap} className="min-h-[48px] flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg transition-transform hover:bg-white/10 active:scale-95 touch-manipulation">{t("swap")}</button>
        <button ref={inviteButtonRef} onClick={() => setIsInviteModalOpen(true)} className="min-h-[48px] flex-1 rounded-2xl bg-gradient-to-b from-[#FFE580] via-[#FFC857] to-[#E59400] py-3 text-xs font-black uppercase tracking-widest text-[#171717] shadow-[0_4px_15px_rgba(255,200,87,0.2)] transition-transform hover:brightness-110 active:scale-95 touch-manipulation">{t("invite")}</button>
      </div>
    </section>
    {isInviteModalOpen && <InviteModal onClose={() => setIsInviteModalOpen(false)} returnFocusRef={inviteButtonRef} />}
  </>;
}

function InviteModal({ onClose, returnFocusRef }: { onClose: () => void; returnFocusRef: React.RefObject<HTMLButtonElement | null> }) {
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const returnFocusElement = returnFocusRef.current;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); returnFocusElement?.focus(); };
  }, [onClose, returnFocusRef]);

  return <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-md" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="invite-dialog-title" className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-b from-[#1E2036] to-[#0D1125] p-6 shadow-2xl ring-1 ring-white/10">
      <div className="flex flex-col items-center">
        <h2 id="invite-dialog-title" className="mb-6 text-xl font-black uppercase tracking-tight text-white">{t("invite_friends")}</h2>
        <p className="mb-8 text-center text-sm text-slate-300">{t("referral_unavailable")}</p>
        <div className="flex w-full gap-3"><button ref={closeButtonRef} onClick={onClose} className="min-h-[44px] flex-1 rounded-xl bg-white/10 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-white/20">{t("close")}</button></div>
      </div>
    </div>
  </div>;
}
