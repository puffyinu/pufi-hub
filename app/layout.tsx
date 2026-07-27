import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";

import "./globals.css";
import { WORLD_CONFIG } from "./config/world";
import { WalletProvider } from "./context/WalletProvider";
import RuntimeBootstrap from "./runtime/RuntimeBootstrap";
import { LanguageProvider } from "./context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PUFI HUB",
  description: "Human Verified Ads Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <MiniKitProvider
            props={{
              appId: WORLD_CONFIG.appId,
            }}
          >
            <WalletProvider>
              <RuntimeBootstrap />
              {children}
            </WalletProvider>
          </MiniKitProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}