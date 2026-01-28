/**
 * Global language state. Persists to localStorage (speechi.uiLanguage).
 * Exposes language, setLanguage, and isRTL for landing and product UI.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getUiLanguage, setUiLanguage } from "../lib/storage";
import type { UiLanguage } from "../lib/storage";

interface LanguageContextValue {
  language: UiLanguage;
  setLanguage: (lang: UiLanguage) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const RTL_LANGS: UiLanguage[] = ["he", "ar"];

function isRtlLang(lang: UiLanguage): boolean {
  return RTL_LANGS.includes(lang);
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<UiLanguage>(() => getUiLanguage());

  useEffect(() => {
    setUiLanguage(language);
  }, [language]);

  const setLanguage = useCallback((lang: UiLanguage) => {
    setLanguageState(lang);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      isRTL: isRtlLang(language),
    }),
    [language, setLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
