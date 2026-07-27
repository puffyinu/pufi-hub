"use client";

import { useState } from "react";
import { Campaign } from "@/app/types/campaign";
import UIFeedback from "./UIFeedback";

interface AddPoolModalProps {
  campaign: Campaign;
  onClose: () => void;
  onConfirm: (token: string, amount: number, clicks: number) => void;
}

export default function AddPoolModal({
  campaign,
  onClose,
  onConfirm,
}: AddPoolModalProps) {
  const [rewardToken, setRewardToken] = useState(campaign.rewardToken || "PUFI");
  const [amount, setAmount] = useState("");
  const [additionalClicks, setAdditionalClicks] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  // Auto-calculate logic
  const handleAmountChange = (val: string) => {
    const numericVal = val.replace(/[^0-9.]/g, "");
    setAmount(numericVal);
    
    const num = Number(numericVal);
    if (num > 0 && campaign.rewardAmount > 0) {
      const clicks = Math.floor(num / campaign.rewardAmount);
      setAdditionalClicks(clicks.toString());
    } else {
      setAdditionalClicks("");
    }
  };

  const handleClicksChange = (val: string) => {
    const numericVal = val.replace(/[^0-9]/g, "");
    setAdditionalClicks(numericVal);
    
    const num = Number(numericVal);
    if (num > 0) {
      const total = Math.round((num * campaign.rewardAmount) * 1e6) / 1e6;
      setAmount(total.toString());
    } else {
      setAmount("");
    }
  };

  const handleSubmit = () => {
    const amt = Number(amount);
    const clk = Number(additionalClicks);

    if (!amt || !clk || amt <= 0 || clk <= 0) {
      setAlertOpen(true);
      return;
    }

    onConfirm(rewardToken, amt, clk);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
      <div className="w-full max-w-[400px] rounded-[32px] border border-white/10 bg-[#0D1125] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tight text-white">
            Add Pool
          </h2>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/5 text-slate-400 transition-all hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          {/* Reward Token */}
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">
              Reward Token
            </label>
            <div className="flex gap-2">
              {["PUFI", "WLD", "USDC"].map((token) => (
                <button
                  key={token}
                  onClick={() => setRewardToken(token)}
                  className={`flex-1 rounded-xl border py-3 text-xs font-black transition-all ${
                    rewardToken === token
                      ? "border-violet-500 bg-violet-500/10 text-violet-400"
                      : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {token}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">
              Amount ({rewardToken})
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm font-bold text-white outline-none focus:border-violet-500/50"
            />
          </div>

          {/* Additional Clicks */}
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">
              Additional Clicks
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={additionalClicks}
              onChange={(e) => handleClicksChange(e.target.value)}
              placeholder="0"
              className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm font-bold text-white outline-none focus:border-violet-500/50"
            />
          </div>

          {/* Summary Info */}
          <div className="rounded-2xl bg-white/[0.02] p-4 border border-white/5">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              <span>Current Reward</span>
              <span className="text-white">{campaign.rewardAmount} {campaign.rewardToken}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <span>New Total Budget</span>
              <span className="text-[#FFC857]">{Math.round((campaign.budget + Number(amount)) * 1e6) / 1e6} {rewardToken}</span>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleSubmit}
            className="mt-4 w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 hover:brightness-110"
          >
            CONFIRM & PAY
          </button>
        </div>
      </div>

      <UIFeedback
        isOpen={alertOpen}
        type="alert"
        title="Invalid Input"
        message="Please enter a valid amount and click count."
        onConfirm={() => setAlertOpen(false)}
      />
    </div>
  );
}
