"use client";

import { useState } from "react";
import { useWalletBalance } from "@/app/hooks/useWalletBalance";

export default function PortfolioCard() {
  const { balance } = useWalletBalance();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Formatting balance to have commas for thousands
  const formattedPufi = parseFloat(balance.pufi).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const handleSwap = () => {
    // Open Holdstation Mini App (temporary implementation using external URL)
    window.open("https://worldcoin.org/mini-app?app_id=app_0d4b759921490adc1f2bd569fda9b53a&app_mode=mini-app", "_blank");
  };

  return (
    <>
      <section className="mx-4 mb-5 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-2xl text-center">
        <h2 className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase mb-4">
          Available Balance
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
            className="flex-1 rounded-2xl bg-white/5 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-white/10 active:scale-95 border border-white/10 shadow-lg"
          >
            Swap
          </button>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex-1 rounded-2xl bg-gradient-to-b from-[#FFE580] via-[#FFC857] to-[#E59400] py-4 text-xs font-black uppercase tracking-widest text-[#171717] shadow-[0_4px_15px_rgba(255,200,87,0.2)] transition-all active:scale-95 hover:brightness-110"
          >
            Invite
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
  const [codeCopyStatus, setCodeCopyStatus] = useState("Copy");
  const [linkCopyStatus, setLinkCopyStatus] = useState("Copy");

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCodeCopyStatus("Copied!");
    setTimeout(() => setCodeCopyStatus("Copy"), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopyStatus("Copied!");
    setTimeout(() => setLinkCopyStatus("Copy"), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join PUFI HUB",
          text: "Use my invite code to join PUFI HUB!",
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md px-6">
      <div className="relative w-full max-w-[360px] overflow-hidden rounded-[32px] bg-gradient-to-b from-[#1E2036] to-[#0D1125] p-8 ring-1 ring-white/10 shadow-2xl">
        <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[60px]" />
        
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-xl font-black text-white mb-6">Invite Friends</h2>
          
          <div className="w-full mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
              Your Invite Code
            </p>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/10">
              <span className="text-lg font-mono font-bold text-yellow-400">{inviteCode}</span>
              <button
                onClick={handleCopyCode}
                className="text-xs font-bold text-white bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                {codeCopyStatus === "Copied!" ? "✅" : "Copy"}
              </button>
            </div>
          </div>

          <div className="w-full mb-8">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
              Invite Link
            </p>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/10 gap-3">
              <p className="text-sm text-slate-300 truncate font-medium flex-1">
                {inviteLink}
              </p>
              <button
                onClick={handleCopyLink}
                className="text-xs font-bold text-white bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors shrink-0"
              >
                {linkCopyStatus === "Copied!" ? "✅" : "Copy"}
              </button>
            </div>
          </div>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl bg-white/10 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/20 active:scale-95"
            >
              Close
            </button>
            <button
              onClick={handleShare}
              className="flex-[2] rounded-2xl bg-gradient-to-b from-[#FFE580] via-[#FFB323] to-[#E59400] py-3.5 text-sm font-black text-[#171717] shadow-lg transition-all active:scale-95 hover:brightness-110"
            >
              Share Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
