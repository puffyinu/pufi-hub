"use client";

import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import { LanguageProvider } from "@/app/context/LanguageContext";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <MiniKitProvider>{children}</MiniKitProvider>
    </LanguageProvider>
  );
}