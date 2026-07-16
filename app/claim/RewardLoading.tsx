"use client";

import { useEffect, useState } from "react";

interface RewardLoadingProps {
  isOpen: boolean;
  onComplete?: () => void;
}

function RewardLoadingContent({ onComplete }: { onComplete?: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Checking Eligibility...",
    "✓ Human Verified",
    "✓ Wallet Connected",
    "✓ Daily Cooldown",
    "✓ Reward Engine",
  ];

  useEffect(() => {
    if (step < steps.length) {
      const timer = setTimeout(() => {
        setStep((s) => s + 1);
      }, 200);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      const finalTimer = setTimeout(onComplete, 400);
      return () => clearTimeout(finalTimer);
    }
  }, [step, steps.length, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0D1125]/80 backdrop-blur-md">
      <div className="flex flex-col items-start gap-3 px-8">
        {steps.map((text, index) => (
          <div
            key={text}
            className={`
              text-lg font-bold transition-all duration-300 
              ${index <= step ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}
              ${index === 0 ? "text-slate-300" : "text-emerald-400"}
            `}
          >
            {text}
          </div>
        ))}
      </div>
      
      <div className="mt-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-yellow-400/20 border-t-yellow-400" />
      </div>
    </div>
  );
}

export default function RewardLoading({ isOpen, onComplete }: RewardLoadingProps) {
  if (!isOpen) return null;
  return <RewardLoadingContent onComplete={onComplete} />;
}