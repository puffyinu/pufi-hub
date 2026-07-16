"use client";

import Image from "next/image";

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RewardModal({ isOpen, onClose }: RewardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md px-6">
      {/* Modal Container */}
      <div className="relative w-full max-w-[360px] overflow-hidden rounded-[32px] bg-gradient-to-b from-[#1E2036] to-[#0D1125] p-8 text-center ring-1 ring-white/10 shadow-2xl">
        
        {/* Background glow for depth and premium feel */}
        <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-yellow-500/20 blur-[60px]" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Puffy Inu Mascot */}
          <div className="mb-6 relative h-40 w-40">
            <Image
              src="/images/mascot/pufi-mascot.png"
              alt="Puffy Inu Mascot"
              fill
              priority
              className="object-contain"
            />
          </div>

          {/* Content */}
          <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
            Daily Reward Ready
          </h2>
          
          <p className="mt-2 mb-8 text-slate-400">
            Congratulations!<br />
            Your reward is ready.
          </p>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full rounded-[24px] bg-gradient-to-b from-[#FFE580] via-[#FFB323] to-[#E59400] py-4 text-xl font-black text-[#171717] shadow-[0_8px_32px_rgba(255,179,35,0.25)] ring-1 ring-yellow-400/30 transition-all active:scale-[0.97] hover:brightness-110"
          >
            OPEN REWARD
          </button>
        </div>
      </div>
    </div>
  );
}