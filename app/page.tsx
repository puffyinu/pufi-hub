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

<div className="absolute inset-0 overflow-hidden pointer-events-none">

  {/* Nebula */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#6D28D955,transparent_55%)]" />

  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#2563EB33,transparent_60%)]" />

  {/* Aurora */}
  <div className="absolute left-1/2 top-1/3 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[150px]" />

  <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-[120px]" />

  <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-500/15 blur-[120px]" />

  {/* Floating Particles */}
  <div className="absolute left-[12%] top-[18%] h-1 w-1 rounded-full bg-white/70 animate-pulse" />
  <div className="absolute left-[28%] top-[65%] h-1 w-1 rounded-full bg-violet-300/70 animate-pulse" />
  <div className="absolute left-[72%] top-[22%] h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" />
  <div className="absolute left-[82%] top-[60%] h-1 w-1 rounded-full bg-blue-300/70 animate-pulse" />
  <div className="absolute left-[50%] top-[12%] h-1 w-1 rounded-full bg-fuchsia-300/70 animate-pulse" />
  <div className="absolute left-[60%] top-[78%] h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" />
  <div className="absolute left-[18%] top-[84%] h-1 w-1 rounded-full bg-violet-300/70 animate-pulse" />
  <div className="absolute left-[88%] top-[38%] h-1 w-1 rounded-full bg-white/70 animate-pulse" />

</div>

      
<div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />


{/* HERO */}

      <section className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center pt-4 pb-10 text-center">
        <h1 className="mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-6xl font-black tracking-tight text-transparent drop-shadow-[0_0_25px_rgba(167,139,250,.45)]">
          {APP_NAME}
        </h1>

        <div className="relative mb-2 pufi-float">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/40 via-fuchsia-500/30 to-blue-500/40 blur-[120px] scale-125" />

          <Image
            src="/images/mascot/pufi-mascot.png"
            alt="PUFI Mascot"
            width={270}
            height={270}
            priority
            className="relative rounded-full pufi-sway pufi-glow"
          />
        </div>

        <div className="mt-2 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-xl shadow-lg shadow-violet-500/20 px-5 py-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />

          <span className="text-[11px] font-bold uppercase tracking-widest text-violet-300">
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
            bg-gradient-to-r from-violet-600 to-blue-600
            py-4
            text-lg
            font-bold
            shadow-2xl
            shadow-violet-600/40
            transition
            duration-300
            hover:from-violet-500 hover:to-blue-500
            active:scale-[0.98]
            disabled:opacity-70
            disabled:cursor-not-allowed
          "
        >
          {loading ? "Connecting..." : "Connect World Wallet"}
        </button>
      </section>
</main>
  );
}