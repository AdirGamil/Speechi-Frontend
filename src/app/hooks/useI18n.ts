/**
 * UI language and i18n strings. Uses LanguageContext (persisted via storage).
 */

import { useMemo } from "react";
import { getStrings, type I18nStrings, type UiLang } from "../lib/i18n";
import { useLanguage } from "../context/LanguageContext";

export function useI18n() {
  const { language, setLanguage, isRTL } = useLanguage();
  const lang = language as UiLang;
  const setLang = setLanguage as (l: UiLang) => void;
  const t = useMemo(() => getStrings(lang), [lang]);

  return { lang, setLang, t, rtl: isRTL };
}

export type { I18nStrings, UiLang };
