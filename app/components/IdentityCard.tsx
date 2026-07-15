"use client";

import Image from "next/image";
import { useWallet } from "@/app/hooks/useWallet";

export default function IdentityCard() {
  const { wallet } = useWallet();

  const username = "CHOQYE";

  return (
    <section className="mx-4 mb-8 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
      <div className="flex items-start justify-between">
        {/* Left */}
        <div className="flex items-center gap-5">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border border-yellow-400/30 bg-white/10">
            <Image
              src="/images/mascot/pufi-mascot.png"
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              {username}
            </h2>

            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-emerald-400">🟢</span>
              <span className="font-medium text-emerald-400">
                Verified
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm">
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
        <div className="mt-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
          Human
        </div>
      </div>
    </section>
  );
}