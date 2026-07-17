"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { executeLandingGateway } from "@/app/services/landingGatewayService";

const APP_NAME = "PUFI HUB";

export default function LandingPage() {
  const router = useRouter();

  const handleConnectWallet = async () => {
    const result = await executeLandingGateway();

    if (!result.success) {
      alert(result.error);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main
      className="
        min-h-[100dvh]
        bg-[#0F172A]
        text-white
        flex
        flex-col
        justify-between
        px-6
        pt-[max(env(safe-area-inset-top),2rem)]
        pb-[max(env(safe-area-inset-bottom),2rem)]
      "
    >
      {/* HERO */}

      <section className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center text-center">
        <div className="relative mb-6 pufi-float">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl" />

          <Image
            src="/images/mascot/pufi-mascot.png"
            alt="PUFI Mascot"
            width={200}
            height={200}
            priority
            className="relative rounded-full pufi-sway pufi-glow"
          />
        </div>

        <h2 className="text-2xl font-bold text-blue-400">
          Welcome Human 👋
        </h2>

        <p className="mt-2 text-slate-400">
          Start earning rewards on World App.
        </p>

        <h1 className="mt-8 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-5xl font-black tracking-tight text-transparent">
          {APP_NAME}
        </h1>

        <div className="mt-6 flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />

          <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">
            Human Verified
          </span>
        </div>

        <button
          onClick={handleConnectWallet}
          className="
            mt-10
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
          "
        >
          Connect World Wallet
        </button>
      </section>

      {/* FOOTER */}

      <footer className="mx-auto w-full max-w-md border-t border-white/10 pt-8 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
          Powered by
        </p>

        <div className="mt-4 flex justify-center gap-6 text-xs font-semibold text-slate-400">
          <span>World App</span>
          <span>MiniKit</span>
          <span>World Chain</span>
        </div>

        <p className="mt-8 text-[11px] italic uppercase tracking-[0.2em] text-slate-600">
          © 2026 PUFFY INU
        </p>
      </footer>
    </main>
  );
}