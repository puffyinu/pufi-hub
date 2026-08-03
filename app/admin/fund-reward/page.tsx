"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { encodeFunctionData, parseUnits } from "viem";
import { useTransaction } from "@/app/hooks/useTransaction";
import { getTransactionState } from "@/app/services/transactionSession";
import AppBackground from "@/app/components/layout/AppBackground";
import { ERC20_ABI, PUFI_CONTRACT } from "@/app/services/contracts";

const REWARD_WALLET = "0xD01482B99F59726b4F9fbb09B1138C546b0D0516";
const WORLD_CHAIN_ID = 480;

export default function FundRewardWalletPage() {
  const router = useRouter();
  const { send, loading, reset } = useTransaction();

  const [amount, setAmount] = useState<string>("");
  const [step, setStep] = useState<"input" | "confirm" | "done">("input");
  const [txHash, setTxHash] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount > 0;

  const handleConfirm = async () => {
    if (!isValidAmount) return;
    reset();
    setErrorMsg("");
    setStep("confirm");
    try {
      const amountInWei = parseUnits(parsedAmount.toString(), 18);
      const data = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [REWARD_WALLET as `0x${string}`, amountInWei],
      });

      await send({
        transactions: [{ to: PUFI_CONTRACT as `0x${string}`, data }],
        chainId: WORLD_CHAIN_ID,
      });

      // Read the freshest state directly from the session store —
      // do NOT rely on the hook's closured `transaction` value here,
      // since React state may not have re-rendered yet.
      const finalState = getTransactionState();

      if (finalState.status === "failed" || finalState.error) {
        setErrorMsg(finalState.error ?? "Transaction failed. Please check your PUFI balance and try again.");
        setStep("input");
        return;
      }

      setTxHash(finalState.transactionId ?? "");
      setStep("done");
    } catch (err) {
      console.error("Fund reward wallet failed:", err);
      setErrorMsg(err instanceof Error ? err.message : "Transaction failed. Please try again.");
      setStep("input");
    }
  };

  const formatAmount = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "0";
    return num.toLocaleString("en-US");
  };

  return (
    <main className="relative min-h-screen text-white" style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px" }}>
      <AppBackground />
      <div className="relative z-10">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-slate-400 text-sm font-semibold">
          ← Back
        </button>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 mb-3">
            <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest">Internal Tool</span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Fund Reward Wallet</h1>
          <p className="mt-1 text-sm text-slate-400">Transfer PUFI from your wallet to the treasury.</p>
        </div>
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Destination — Reward Wallet</p>
          <p className="font-mono text-xs text-violet-300 break-all">{REWARD_WALLET}</p>
        </div>

        {step === "input" && (
          <div className="space-y-4">
            {errorMsg && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
                <p className="text-red-400 text-xs font-semibold">{errorMsg}</p>
              </div>
            )}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                Amount to Transfer (PUFI)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 1000000"
                className="w-full bg-transparent text-white text-2xl font-black outline-none placeholder:text-slate-600"
              />
              {isValidAmount && (
                <p className="mt-2 text-xs text-slate-500">= {formatAmount(amount)} PUFI</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["100000", "500000", "1000000"].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className="rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors"
                >
                  {parseInt(preset).toLocaleString("en-US")}
                </button>
              ))}
            </div>
            <button
              onClick={handleConfirm}
              disabled={!isValidAmount}
              className={`w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                isValidAmount
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg"
                  : "bg-white/5 text-slate-600 cursor-not-allowed"
              }`}
            >
              Review Transfer
            </button>
          </div>
        )}

        {step === "confirm" && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-violet-600/10 flex items-center justify-center">
                {loading ? (
                  <svg className="animate-spin h-7 w-7 text-violet-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <span className="text-3xl">⏳</span>
                )}
              </div>
            </div>
            <div>
              <p className="font-black text-white text-lg">{loading ? "Waiting for Approval..." : "Processing..."}</p>
              <p className="text-slate-400 text-sm mt-1">Approve the transaction in World App</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Sending</p>
              <p className="text-white font-black text-xl">{formatAmount(amount)} PUFI</p>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-4xl">✅</div>
            </div>
            <div>
              <p className="font-black text-white text-lg">Transfer Submitted</p>
              <p className="text-slate-400 text-sm mt-1">Transaction sent to World Chain</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Amount</p>
              <p className="text-emerald-400 font-black text-xl">{formatAmount(amount)} PUFI</p>
            </div>
            {txHash && (
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Transaction ID</p>
                <p className="font-mono text-xs text-slate-300 break-all">{txHash}</p>
              </div>
            )}
            <button
              onClick={() => { setStep("input"); setAmount(""); setTxHash(""); setErrorMsg(""); reset(); }}
              className="w-full h-12 rounded-2xl bg-white/5 text-sm font-bold text-slate-300"
            >
              Send Another
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
