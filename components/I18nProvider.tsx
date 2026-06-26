"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  categoryLabels,
  contactMethodLabels,
  defaultLanguage,
  languageStorageKey,
  locationGroupLabels,
  reportReasonLabels,
  statusLabels,
  translate,
  userTypeLabels,
  type Language,
  type TranslationKey
} from "@/lib/i18n";
import { getLocationLabel } from "@/lib/data";
import type {
  ContactMethodKey,
  ProductCategoryKey,
  ProductLocationKey,
  ProductStatusKey,
  UserTypeKey
} from "@/lib/types";

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLanguage(): Language {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  try {
    const stored = window.localStorage.getItem(languageStorageKey);
    if (stored === "en" || stored === "zh") {
      return stored;
    }
  } catch {
    // Some embedded browsers restrict storage APIs; cookie fallback keeps the preference stable.
  }

  const cookieLanguage = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${languageStorageKey}=`))
    ?.split("=")[1];

  return cookieLanguage === "en" || cookieLanguage === "zh" ? cookieLanguage : defaultLanguage;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    setLanguageState(readStoredLanguage());
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    try {
      window.localStorage.setItem(languageStorageKey, language);
    } catch {
      // Cookie below is the fallback.
    }
    document.cookie = `${languageStorageKey}=${language}; path=/; max-age=31536000; SameSite=Lax`;
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage: setLanguageState,
      t: (key, values) => translate(key, language, values)
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}

export function T({
  k,
  values
}: {
  k: TranslationKey;
  values?: Record<string, string | number>;
}) {
  const { t } = useI18n();
  return <>{t(k, values)}</>;
}

export function LanguageToggle() {
  const { language, setLanguage } = useI18n();
  const nextLanguage = language === "zh" ? "en" : "zh";

  return (
    <button
      className="rounded-full border border-[#E4BEBA] bg-white/90 px-3 py-2 text-xs font-extrabold text-[#5B403E] shadow-sm transition hover:bg-[#FFF1EF]"
      type="button"
      onClick={() => setLanguage(nextLanguage)}
    >
      {language === "zh" ? "EN" : "中文"}
    </button>
  );
}

export function CategoryLabel({ value }: { value: ProductCategoryKey }) {
  const { language } = useI18n();
  return <>{categoryLabels[value]?.[language] ?? value}</>;
}

export function StatusLabel({ value }: { value: ProductStatusKey }) {
  const { language } = useI18n();
  return <>{statusLabels[value]?.[language] ?? value}</>;
}

export function UserTypeLabel({ value }: { value: UserTypeKey }) {
  const { language } = useI18n();
  return <>{userTypeLabels[value]?.[language] ?? value}</>;
}

export function ContactMethodLabel({ value }: { value: ContactMethodKey }) {
  const { language } = useI18n();
  return <>{contactMethodLabels[value]?.[language] ?? value}</>;
}

export function LocationLabel({ value }: { value: ProductLocationKey }) {
  return <>{getLocationLabel(value)}</>;
}

export function LocationGroupLabel({ value }: { value: string }) {
  const { language } = useI18n();
  return <>{locationGroupLabels[value]?.[language] ?? value}</>;
}

export function ReportReasonLabel({ value }: { value: string }) {
  const { language } = useI18n();
  return <>{reportReasonLabels[value]?.[language] ?? value}</>;
}

export function useLocalizedDate() {
  const { language } = useI18n();

  return (createdAt: string) => {
    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return createdAt;
    }

    return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };
}

export function DateLabel({ value }: { value: string }) {
  const formatDate = useLocalizedDate();
  return <>{formatDate(value)}</>;
}
