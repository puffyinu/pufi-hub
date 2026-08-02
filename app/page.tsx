"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { executeLandingGateway } from "@/app/services/landingGatewayService";

const APP_NAME = "PUFI HUB";

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    if (loading) return;

    console.log("[PAGE-1] Button Clicked");
    setLoading(true);
    setError(null);

    try {
      const result = await executeLandingGateway();

      console.log("[PAGE-2] Gateway Result =", result);

      if (!result.success) {
        console.log("[PAGE-3] Gateway Failed");
        setError(result.error ?? "Connection failed");
        setLoading(false);
        return;
      }

      console.log("[PAGE-4] router.push('/dashboard')");
      router.push("/dashboard");
    } catch (err) {
      console.error("[PAGE-ERROR]", err);
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <main
  className="
    relative
    h-[100dvh]
    overflow-hidden
    bg-[#070B1A]
    text-white
    flex
    flex-col
    justify-between
    px-6
    pt-[max(env(safe-area-inset-top),1rem)]
    pb-[max(env(safe-area-inset-bottom),2rem)]
  "
>

{/* Cosmic Background */}

<div className="absolute inset-0 overflow-hidden">

  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#4F46E530,transparent_60%)]" />

  <div className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[140px]" />

  <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />

  <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-[120px]" />

</div>

      {/* HERO */}

      <section className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center pt-4 pb-10 text-center">
        <h1 className="mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-5xl font-black tracking-tight text-transparent">
          {APP_NAME}
        </h1>

        <div className="relative mb-2 pufi-float">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl" />

          <Image
            src="/images/mascot/pufi-mascot.png"
            alt="PUFI Mascot"
            width={270}
            height={270}
            priority
            className="relative rounded-full pufi-sway pufi-glow"
          />
        </div>

        <div className="mt-2 flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />

          <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">
            Human Verified
          </span>
        </div>

        {error && (
          <div className="mt-4 w-full rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-xs text-red-400">
            {error}
          </div>
        )}

        <button
          onClick={handleConnectWallet}
          disabled={loading}
          className="
            mt-6
            w-full
            rounded-2xl
            bg-blue-600
            py-4
            text-lg
            font-bold
            shadow-2xl
            shadow-blue-600/30
            transition
            duration-300
            hover:bg-blue-500
            active:scale-[0.98]
            disabled:opacity-70
            disabled:cursor-not-allowed
          "
        >
          {loading ? "Connecting..." : "Connect World Wallet"}
        </button>
      </section>

      {/* FOOTER */}

      <footer className="mx-auto w-full max-w-md border-t border-white/10 pt-4 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
          Powered by
        </p>

        <div className="mt-4 flex justify-center gap-6 text-xs font-semibold text-slate-400">
          <span>World App</span>
          <span>MiniKit</span>
          <span>World Chain</span>
        </div>

        <p className="mt-6 text-[11px] italic uppercase tracking-[0.2em] text-slate-600">
          © 2026 PUFFY INU
        </p>
      </footer>
    </main>
  );
}