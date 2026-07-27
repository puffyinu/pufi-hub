"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage, type Language } from "@/app/context/LanguageContext";
import BottomNav from "@/app/components/BottomNav";

export default function LanguagePage() {
  const { language, setLanguage, t } = useLanguage();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "id", name: "Indonesia", nativeName: "Indonesia" },
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "es-MX", name: "Spanish (Mexico)", nativeName: "Español (México)" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { code: "ko", name: "Korean", nativeName: "한국어" },
    { code: "ja", name: "Japanese", nativeName: "日本語" },
  ];

  const handleLanguageChange = (code: Language) => {
    if (code === language) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setLanguage(code);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-[#FFC857]/30">
      {/* Background */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1757] via-[#181633] to-[#0D1125]" />
        <div className="pointer-events-none absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="pointer-events-none absolute top-0 right-[-80px] h-[260px] w-[260px] rounded-full bg-[#FFC857]/10 blur-[120px]" />
      </div>

      <div className="relative z-0 mx-auto flex max-w-[480px] flex-col px-6">
        {/* Header */}
        <header className="flex items-center justify-between py-8">
          <Link
            href="/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          
          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFC857"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <h1 className="text-lg font-black uppercase tracking-widest text-[#FFC857]">
              {t("language")}
            </h1>
          </div>
          
          <div className="w-10" /> {/* Spacer */}
        </header>

        <main className={`flex-1 pb-32 transition-opacity duration-200 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
          <div className="mb-8">
            <h2 className="text-2xl font-black tracking-tight">{t("select_language")}</h2>
            <p className="mt-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">{t("select_language_desc")}</p>
          </div>

          <div className="flex flex-col gap-2.5">
            {languages.map((lang) => {
              const isSelected = language === lang.code;

              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center justify-between rounded-2xl border px-5 py-4 transition-all active:scale-[0.98] ${
                    isSelected
                      ? "border-[#FFC857] bg-[#FFC857]/10"
                      : "border-white/5 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span className={`text-[15px] font-black tracking-tight ${isSelected ? "text-[#FFC857]" : "text-white"}`}>
                    {lang.nativeName}
                  </span>

                  {isSelected && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFC857] text-[#171717]">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
