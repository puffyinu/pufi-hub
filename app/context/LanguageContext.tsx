"use client";

import React, { createContext, useContext, useSyncExternalStore, useEffect } from "react";

export type Language = "en" | "id" | "es" | "es-MX" | "hi" | "ko" | "ja";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    campaign: "Campaign",
    claim: "Claim",
    wallet: "Wallet",
    creator: "Creator",
    language: "Language",
    select_language: "Select Language",
    select_language_desc: "Choose your preferred interface language",
    back: "Back",
    verified: "Verified",
    connected: "Connected",
    disconnected: "Disconnected",
    human: "Human",
    available_balance: "Available Balance",
    swap: "Swap",
    invite: "Invite",
    invite_friends: "Invite Friends",
    your_invite_code: "Your Invite Code",
    invite_link: "Invite Link",
    copy: "Copy",
    copied: "Copied!",
    close: "Close",
    share_now: "Share Now",
    community_stream: "Community Stream",
    live: "Live",
    performance_hub: "Performance Hub",
    campaigns_joined: "Campaigns Joined",
    total_rewards: "Total Rewards",
    activity_log: "Activity Log",
  },
  id: {
    dashboard: "Dasbor",
    campaign: "Kampanye",
    claim: "Klaim",
    wallet: "Dompet",
    creator: "Kreator",
    language: "Bahasa",
    select_language: "Pilih Bahasa",
    back: "Kembali",
    verified: "Terverifikasi",
    connected: "Terhubung",
    disconnected: "Terputus",
    human: "Manusia",
    available_balance: "Saldo Tersedia",
    swap: "Tukar",
    invite: "Undang",
    invite_friends: "Undang Teman",
    your_invite_code: "Kode Undangan Anda",
    invite_link: "Tautan Undangan",
    copy: "Salin",
    copied: "Tersalin!",
    close: "Tutup",
    share_now: "Bagikan Sekarang",
    community_stream: "Aliran Komunitas",
    live: "Langsung",
    performance_hub: "Pusat Performa",
    campaigns_joined: "Kampanye Diikuti",
    total_rewards: "Total Hadiah",
    activity_log: "Log Aktivitas",
  },
  es: {
    dashboard: "Tablero",
    campaign: "Campaña",
    claim: "Reclamar",
    wallet: "Billetera",
    creator: "Creador",
    language: "Idioma",
    select_language: "Seleccionar Idioma",
    back: "Atrás",
    verified: "Verificado",
    connected: "Conectado",
    disconnected: "Desconectado",
    human: "Humano",
    available_balance: "Saldo Disponible",
    swap: "Intercambiar",
    invite: "Invitar",
    invite_friends: "Invitar Amigos",
    your_invite_code: "Tu Código de Invitación",
    invite_link: "Enlace de Invitación",
    copy: "Copiar",
    copied: "¡Copiado!",
    close: "Cerrar",
    share_now: "Compartir Ahora",
    community_stream: "Transmisión de la Comunidad",
    live: "En Vivo",
    performance_hub: "Centro de Rendimiento",
    campaigns_joined: "Campañas Unidas",
    total_rewards: "Total de Premios",
    activity_log: "Registro de Actividad",
  },
  "es-MX": {
    dashboard: "Tablero",
    campaign: "Campaña",
    claim: "Reclamar",
    wallet: "Billetera",
    creator: "Creador",
    language: "Idioma",
    select_language: "Seleccionar Idioma",
    back: "Atrás",
    verified: "Verificado",
    connected: "Conectado",
    disconnected: "Desconectado",
    human: "Humano",
    available_balance: "Saldo Disponible",
    swap: "Intercambiar",
    invite: "Invitar",
    invite_friends: "Invitar Amigos",
    your_invite_code: "Tu Código de Invitación",
    invite_link: "Enlace de Invitación",
    copy: "Copiar",
    copied: "¡Copiado!",
    close: "Cerrar",
    share_now: "Compartir Ahora",
    community_stream: "Transmisión de la Comunidad",
    live: "En Vivo",
    performance_hub: "Centro de Rendimiento",
    campaigns_joined: "Campañas Unidas",
    total_rewards: "Total de Premios",
    activity_log: "Registro de Actividad",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    campaign: "अभियान",
    claim: "दावा करें",
    wallet: "वॉलेट",
    creator: "निर्माता",
    language: "भाषा",
    select_language: "भाषा चुनें",
    back: "पीछे",
    verified: "सत्यापित",
    connected: "जुड़ा हुआ",
    disconnected: "डिस्कनेक्ट",
    human: "मानव",
    available_balance: "उपलब्ध शेष राशि",
    swap: "स्वैप",
    invite: "आमंत्रित करें",
    invite_friends: "दोस्तों को आमंत्रित करें",
    your_invite_code: "आपका आमंत्रण कोड",
    invite_link: "आमंत्रण लिंक",
    copy: "कॉपी",
    copied: "कॉपी किया गया!",
    close: "बंद करें",
    share_now: "अभी साझा करें",
    community_stream: "सामुदायिक स्ट्रीम",
    live: "लाइव",
    performance_hub: "प्रदर्शन हब",
    campaigns_joined: "जुड़ा अभियान",
    total_rewards: "कुल पुरस्कार",
    activity_log: "गतिविधि लॉग",
  },
  ko: {
    dashboard: "대시보드",
    campaign: "캠페인",
    claim: "클레임",
    wallet: "지갑",
    creator: "크리에이터",
    language: "언어",
    select_language: "언어 선택",
    back: "뒤로",
    verified: "인증됨",
    connected: "연결됨",
    disconnected: "연결 끊김",
    human: "사람",
    available_balance: "사용 가능한 잔액",
    swap: "스왑",
    invite: "초대",
    invite_friends: "친구 초대",
    your_invite_code: "내 초대 코드",
    invite_link: "초대 링크",
    copy: "복사",
    copied: "복사됨!",
    close: "닫기",
    share_now: "지금 공유",
    community_stream: "커뮤니티 스트림",
    live: "라이브",
    performance_hub: "퍼포먼스 허브",
    campaigns_joined: "참여한 캠페인",
    total_rewards: "총 보상",
    activity_log: "활동 로그",
  },
  ja: {
    dashboard: "ダッシュボード",
    campaign: "キャンペーン",
    claim: "クレーム",
    wallet: "ウォレット",
    creator: "クリエイター",
    language: "言語",
    select_language: "言語を選択",
    back: "戻る",
    verified: "認証済み",
    connected: "接続済み",
    disconnected: "切단",
    human: "人間",
    available_balance: "利用可能な残高",
    swap: "スワップ",
    invite: "招待",
    invite_friends: "友達を招待",
    your_invite_code: "あなたの招待コード",
    invite_link: "招待リンク",
    copy: "コピー",
    copied: "コピーしました！",
    close: "閉じる",
    share_now: "今すぐ共有",
    community_stream: "コミュニティストリーム",
    live: "ライブ",
    performance_hub: "パフォーマンスハブ",
    campaigns_joined: "参加したキャンペーン",
    total_rewards: "総報酬",
    activity_log: "アクティビティログ",
  },
};

// External store for language
let currentLanguage: Language = "en";
const listeners = new Set<() => void>();

const languageStore = {
  subscribe(callback: () => void) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
  getSnapshot() {
    return currentLanguage;
  },
  getServerSnapshot() {
    return "en" as Language;
  },
  setLanguage(lang: Language) {
    currentLanguage = lang;
    if (typeof window !== "undefined") {
      localStorage.setItem("pufi_language", lang);
    }
    listeners.forEach((l) => l());
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const language = useSyncExternalStore(
    languageStore.subscribe,
    languageStore.getSnapshot,
    languageStore.getServerSnapshot
  );

  useEffect(() => {
    const saved = localStorage.getItem("pufi_language") as Language;
    if (saved && translations[saved] && saved !== currentLanguage) {
      languageStore.setLanguage(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    languageStore.setLanguage(lang);
  };

  const t = (key: string) => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
