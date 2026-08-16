"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useWallet } from "@/app/hooks/useWallet";
import { useLanguage } from "@/app/context/LanguageContext";
import { getSession, SESSION_EVENT } from "@/app/services/session";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(SESSION_EVENT, onStoreChange);
  return () => window.removeEventListener(SESSION_EVENT, onStoreChange);
}

function formatUsername(username?: string): string | undefined {
  const normalized = username?.trim();
  return normalized ? (normalized.includes("@") ? normalized : `@${normalized}`) : undefined;
}

export default function IdentityCard() {
  const { wallet } = useWallet();
  const { t } = useLanguage();
  const session = useSyncExternalStore(subscribe, getSession, () => null);
  const isMounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const username = formatUsername(session?.user?.username);
  const profilePictureUrl = session?.user?.profilePictureUrl;
  const [avatarFailedFor, setAvatarFailedFor] = useState<string | null>(null);
  const [avatarLoadedFor, setAvatarLoadedFor] = useState<string | null>(null);
  const shouldShowProfilePicture = Boolean(profilePictureUrl) && avatarFailedFor !== profilePictureUrl;

  return (
    <section className="mx-4 mb-5 rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-yellow-400/20 bg-white/5 shadow-inner">
            <Image src="/images/mascot/pufi-mascot.png" alt="PUFI mascot" fill className="object-cover scale-110" />
            {profilePictureUrl && shouldShowProfilePicture && (
              // World profile-picture hosts are dynamic. Keep the mascot visible until the remote image loads.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profilePictureUrl}
                alt={username ? `${username} profile picture` : "World profile picture"}
                referrerPolicy="no-referrer"
                onLoad={() => setAvatarLoadedFor(profilePictureUrl)}
                onError={() => {
                  setAvatarFailedFor(profilePictureUrl);
                  setAvatarLoadedFor(null);
                }}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${avatarLoadedFor === profilePictureUrl ? "opacity-100" : "opacity-0"}`}
              />
            )}
          </div>

          <div className="flex flex-col gap-0.5">
            <h2 className="text-lg font-black tracking-tight text-white">{username ?? "World User"}</h2>
            <div className="mt-1 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <span aria-hidden="true" className="h-4 w-4 rounded-full bg-emerald-500/10 after:mx-auto after:mt-[5px] after:block after:h-1.5 after:w-1.5 after:rounded-full after:bg-emerald-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">{t("verified")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span aria-hidden="true" className="h-4 w-4 rounded-full bg-white/5 after:mx-auto after:mt-[5px] after:block after:h-1.5 after:w-1.5 after:rounded-full after:bg-slate-300" />
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isMounted && wallet.connected ? "text-yellow-400" : "text-red-400"}`}>
                  {isMounted && wallet.connected ? t("connected") : t("disconnected")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400">{t("human")}</div>
      </div>
    </section>
  );
}
