/**
 * Settings: Premium design with sections for language, theme, privacy, and history.
 */

import { useCallback, useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useHistory } from "../hooks/useHistory";
import { useI18n } from "../hooks/useI18n";
import { useTheme } from "../hooks/useTheme";
import { getOutputLanguage, setOutputLanguage } from "../lib/storage";
import { OUTPUT_LANGUAGES } from "../lib/constants";
import { Modal } from "../components/Modal";
import {
  HiCog6Tooth,
  HiLanguage,
  HiSun,
  HiMoon,
  HiShieldCheck,
  HiTrash,
  HiExclamationTriangle,
} from "react-icons/hi2";

const FLAGS: Record<string, string> = {
  en: "🇺🇸",
  he: "🇮🇱",
  fr: "🇫🇷",
  es: "🇪🇸",
  ar: "🇸🇦",
};

// Settings section wrapper
function SettingsSection({ 
  children, 
  delay = 0 
}: { 
  children: React.ReactNode;
  delay?: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const el = sectionRef.current;
    if (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay }
      );
    }
  }, [delay]);

  return (
    <div
      ref={sectionRef}
      className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/80"
    >
      {children}
    </div>
  );
}

export function SettingsPage() {
  const { t } = useI18n();
  const { toggleTheme, isDark } = useTheme();
  const { clear, items } = useHistory();
  const [outputLang, setOutputLangState] = useState<string>(() => getOutputLanguage());
  const [showClearModal, setShowClearModal] = useState(false);

  const handleOutputLang = useCallback((value: string) => {
    setOutputLangState(value);
    setOutputLanguage(value as "en" | "he" | "fr" | "es" | "ar");
  }, []);

  const handleClear = useCallback(() => {
    clear();
    setShowClearModal(false);
  }, [clear]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white">
          <HiCog6Tooth className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{t.settingsTitle}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Customize your Speechi experience
          </p>
        </div>
      </div>

      {/* Default Output Language */}
      <SettingsSection delay={0}>
        <div className="flex items-center gap-3 mb-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 to-sky-600 text-white">
            <HiLanguage className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              {t.defaultOutputLanguage}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Default language for summaries and transcripts
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {OUTPUT_LANGUAGES.map((lang) => {
            const isSelected = outputLang === lang.value;
            return (
              <button
                key={lang.value}
                type="button"
                onClick={() => handleOutputLang(lang.value)}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? "bg-linear-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25"
                    : "border border-zinc-200 bg-white text-zinc-700 hover:border-indigo-300 hover:bg-indigo-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/30"
                }`}
              >
                <span className="text-base">{FLAGS[lang.value]}</span>
                <span className="hidden sm:inline">{lang.label}</span>
              </button>
            );
          })}
        </div>
      </SettingsSection>

      {/* Theme */}
      <SettingsSection delay={0.1}>
        <div className="flex items-center gap-3 mb-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-amber-500 to-orange-600 text-white">
            {isDark ? <HiMoon className="h-5 w-5" /> : <HiSun className="h-5 w-5" />}
          </span>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{t.theme}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Choose between light and dark mode
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => !isDark || toggleTheme()}
            className={`flex cursor-pointer items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-200 ${
              !isDark
                ? "bg-linear-to-r from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/25"
                : "border border-zinc-200 bg-white text-zinc-700 hover:border-amber-300 hover:bg-amber-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-amber-600/50"
            }`}
          >
            <HiSun className="h-5 w-5" />
            Light
          </button>
          <button
            type="button"
            onClick={() => isDark || toggleTheme()}
            className={`flex cursor-pointer items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-200 ${
              isDark
                ? "bg-linear-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25"
                : "border border-zinc-200 bg-white text-zinc-700 hover:border-indigo-300 hover:bg-indigo-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            <HiMoon className="h-5 w-5" />
            Dark
          </button>
        </div>
      </SettingsSection>

      {/* Privacy */}
      <SettingsSection delay={0.2}>
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 text-white">
            <HiShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{t.privacyTitle}</h3>
            <p className="mt-2 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t.privacyText}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <HiShieldCheck className="h-3.5 w-3.5" />
                Local storage only
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <HiShieldCheck className="h-3.5 w-3.5" />
                No cloud sync
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <HiShieldCheck className="h-3.5 w-3.5" />
                Your data stays on your device
              </span>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Danger Zone */}
      <SettingsSection delay={0.3}>
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-red-500 to-rose-600 text-white">
            <HiExclamationTriangle className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Danger Zone</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              These actions are irreversible
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowClearModal(true)}
                disabled={items.length === 0}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-all duration-200 hover:bg-red-100 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-900/40"
              >
                <HiTrash className="h-4 w-4" />
                {t.clearHistory}
                {items.length > 0 && (
                  <span className="rounded-md bg-red-100 px-1.5 py-0.5 text-xs dark:bg-red-900/50">
                    {items.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Clear History Modal */}
      {showClearModal && (
        <Modal
          title={t.clearHistoryConfirm}
          cancelLabel={t.cancel}
          confirmLabel={t.confirm}
          confirmDanger
          onCancel={() => setShowClearModal(false)}
          onConfirm={handleClear}
        >
          {t.clearHistoryConfirmBody}
        </Modal>
      )}
    </div>
  );
}
