"use client";

import Image from "next/image";
import { useWallet } from "@/app/hooks/useWallet";

export default function WelcomeCard() {
  const { wallet } = useWallet();

  const username = "CHOQYE";

  return (
    <section className="w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-xl">
      <div className="flex items-start justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-full border border-yellow-400/30 bg-white/10">
            <Image
              src="/images/pufi-mascot.png"
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">
              {username}
            </h2>

            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-emerald-400">🟢</span>
              <span className="font-medium text-emerald-400">
                Verified
              </span>
            </div>

            <div className="mt-1 flex items-center gap-2 text-sm">
              <span>👛</span>

              <span
                className={
                  wallet.connected
                    ? "font-medium text-yellow-400"
                    : "font-medium text-red-400"
                }
              >
                {wallet.connected
                  ? "Wallet Connected"
                  : "Wallet Disconnected"}
              </span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
          Human
        </div>
      </div>
    </section>
  );
}