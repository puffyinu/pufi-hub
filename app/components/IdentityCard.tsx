"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { useWallet } from "@/app/hooks/useWallet";

const subscribe = () => () => {};

export default function IdentityCard() {
  const { wallet } = useWallet();
  const isMounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const username = "CHOQYE";

  return (
    <section className="mx-4 mb-5 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-2xl p-5 shadow-2xl">
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-yellow-400/20 bg-white/5 shadow-inner">
            <Image
              src="/images/mascot/pufi-mascot.png"
              alt="Avatar"
              fill
              className="object-cover scale-110"
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <h2 className="text-lg font-black tracking-tight text-white">
              {username}
            </h2>

            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex items-center gap-1.5">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/10">
                  <span className="text-[8px]">🟢</span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Verified
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white/5">
                  <span className="text-[10px]">👛</span>
                </div>

                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isMounted && wallet.connected
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {isMounted && wallet.connected
                    ? "Connected"
                    : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="rounded-xl bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/20">
          Human
        </div>
      </div>
    </section>
  );
}