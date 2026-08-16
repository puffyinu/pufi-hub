import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import "./globals.css";
import { WORLD_CONFIG } from "./config/world";
import { WalletProvider } from "./context/WalletProvider";
import RuntimeBootstrap from "./runtime/RuntimeBootstrap";
import { LanguageProvider } from "./context/LanguageContext";
import DebugConsole from "./components/DebugConsole";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PUFI HUB",
  description: "Human Verified Ads Marketplace on World Chain",
  applicationName: "PUFI HUB Mini App",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PUFI HUB",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#020617", // Slate 950
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-50 overscroll-none select-none antialiased">
        <DebugConsole />
        <LanguageProvider>
          <MiniKitProvider
            props={{
              appId: WORLD_CONFIG.appId,
            }}
          >
            <WalletProvider>
              <RuntimeBootstrap />
              <main className="flex-1 flex flex-col w-full max-w-md mx-auto relative overflow-x-hidden">
                {children}
              </main>
            </WalletProvider>
          </MiniKitProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
