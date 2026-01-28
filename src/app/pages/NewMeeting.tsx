/**
 * New Meeting: Premium guided flow with GSAP animations.
 * Upload → Language → Analyze → Results with tabbed view.
 * Includes usage limit checking and registration prompts.
 */

import { useCallback, useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { analyzeMeeting, exportPdf, exportWord, type ApiResult } from "../lib/api";
import { OUTPUT_LANGUAGES } from "../lib/constants";
import { getOutputLanguage, setOutputLanguage } from "../lib/storage";
import { useHistory } from "../hooks/useHistory";
import { useI18n } from "../hooks/useI18n";
import { useAuthContext } from "../context/AuthContext";
import { SummaryCard } from "../components/SummaryCard";
import { ExportDropdown } from "../components/ExportDropdown";
import { UploadZone } from "../components/UploadZone";
import { AudioRecorder } from "../components/AudioRecorder";
import { Tabs, type TabItem } from "../components/Tabs";
import { Toast } from "../components/Toast";
import { AuthModal } from "../components/AuthModal";
import {
  HiSparkles,
  HiDocumentText,
  HiLanguage,
  HiClipboardDocumentList,
  HiUsers,
  HiCheckCircle,
  HiExclamationCircle,
  HiExclamationTriangle,
  HiLockClosed,
  HiMicrophone,
  HiCloudArrowUp,
} from "react-icons/hi2";

// Animated loading component
function AnalyzingLoader({ message, hint }: { message: string; hint: string }) {
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const dots = dotsRef.current?.querySelectorAll(".dot");
    if (dots) {
      gsap.to(dots, {
        y: -8,
        duration: 0.4,
        ease: "power2.inOut",
        stagger: {
          each: 0.15,
          repeat: -1,
          yoyo: true,
        },
      });
    }

    return () => {
      if (dots) gsap.killTweensOf(dots);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Animated icon */}
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
          <HiSparkles className="h-10 w-10 text-white" />
        </div>
        {/* Pulsing ring */}
        <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 animate-ping" style={{ animationDuration: '2s' }} />
      </div>

      {/* Loading dots */}
      <div ref={dotsRef} className="mb-4 flex gap-2">
        <div className="dot h-2 w-2 rounded-full bg-indigo-500" />
        <div className="dot h-2 w-2 rounded-full bg-violet-500" />
        <div className="dot h-2 w-2 rounded-full bg-indigo-500" />
      </div>

      <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">{message}</p>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{hint}</p>
    </div>
  );
}

// Usage limit banner - uses i18n strings
function UsageLimitBanner({ 
  isRegistered, 
  limit,
  onSignUp,
  t
}: { 
  isRegistered: boolean;
  limit: number;
  onSignUp: () => void;
  t: ReturnType<typeof useI18n>["t"];
}) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const el = bannerRef.current;
    if (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, []);

  // Get localized messages
  const title = isRegistered ? t.usageLimitRegisteredTitle : t.usageLimitGuestTitle;
  const message = isRegistered 
    ? t.usageLimitRegisteredMessage.replace("{limit}", String(limit))
    : t.usageLimitGuestMessage;

  return (
    <div
      ref={bannerRef}
      className={`rounded-2xl border p-5 ${
        isRegistered
          ? "border-amber-200/60 bg-amber-50/80 dark:border-amber-800/40 dark:bg-amber-950/30"
          : "border-indigo-200/60 bg-indigo-50/80 dark:border-indigo-800/40 dark:bg-indigo-950/30"
      }`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isRegistered
              ? "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400"
              : "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400"
          }`}
        >
          {isRegistered ? (
            <HiExclamationTriangle className="h-5 w-5" />
          ) : (
            <HiLockClosed className="h-5 w-5" />
          )}
        </span>
        <div className="flex-1">
          <h3
            className={`text-base font-semibold ${
              isRegistered
                ? "text-amber-800 dark:text-amber-300"
                : "text-indigo-800 dark:text-indigo-300"
            }`}
          >
            {title}
          </h3>
          <p
            className={`mt-1 text-sm ${
              isRegistered
                ? "text-amber-700 dark:text-amber-400"
                : "text-indigo-700 dark:text-indigo-400"
            }`}
          >
            {message}
          </p>
          {!isRegistered && (
            <button
              type="button"
              onClick={onSignUp}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              <HiSparkles className="h-4 w-4" />
              {t.authSignUpFree}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Language selector with flags
function OutputLanguageSelector({ 
  value, 
  onChange, 
  disabled 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  disabled: boolean;
}) {
  const { t } = useI18n();
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const el = selectRef.current;
    if (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay: 0.1 }
      );
    }
  }, []);

  const flags: Record<string, string> = {
    en: "🇺🇸",
    he: "🇮🇱",
    fr: "🇫🇷",
    es: "🇪🇸",
    ar: "🇸🇦",
  };

  return (
    <div ref={selectRef} className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/80">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 to-sky-600 text-white">
          <HiLanguage className="h-5 w-5" />
        </span>
        <div>
          <label className="block text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {t.outputLanguage}
          </label>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.outputLanguageHint}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {OUTPUT_LANGUAGES.map((lang) => {
          const isSelected = value === lang.value;
          return (
            <button
              key={lang.value}
              type="button"
              onClick={() => onChange(lang.value)}
              disabled={disabled}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? "bg-linear-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25"
                  : "border border-zinc-200 bg-white text-zinc-700 hover:border-indigo-300 hover:bg-indigo-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/30"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <span className="text-base">{flags[lang.value]}</span>
              <span className="hidden sm:inline">{lang.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Action buttons section - uses "used/limit" format with i18n
function ActionButtons({
  canAnalyze,
  canExport,
  onAnalyze,
  onExportWord,
  onExportPdf,
  t,
  used,
  limit,
}: {
  canAnalyze: boolean;
  canExport: boolean;
  onAnalyze: () => void;
  onExportWord: () => void;
  onExportPdf: () => void;
  t: ReturnType<typeof useI18n>["t"];
  used: number;
  limit: number;
}) {
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const buttons = buttonsRef.current?.querySelectorAll("button, .export-dropdown");
    if (buttons) {
      gsap.fromTo(
        buttons,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.1, delay: 0.2 }
      );
    }
  }, []);

  return (
    <div ref={buttonsRef} className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!canAnalyze}
          className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg dark:focus:ring-offset-zinc-950"
        >
          <HiSparkles className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          {t.analyze}
        </button>
        
        <div className="export-dropdown">
          <ExportDropdown
            disabled={!canExport}
            t={t}
            onExportWord={onExportWord}
            onExportPdf={onExportPdf}
          />
        </div>
      </div>

      {/* Usage indicator - shows USED/LIMIT format */}
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        <span className="inline-flex items-center gap-1.5">
          <HiSparkles className="h-4 w-4 text-indigo-500" />
          {t.usageIndicator.replace("{used}", String(used)).replace("{limit}", String(limit))}
        </span>
      </p>
    </div>
  );
}

// Empty decisions state
function EmptyDecisions({ t }: { t: ReturnType<typeof useI18n>["t"] }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600">
        <HiClipboardDocumentList className="h-8 w-8" />
      </span>
      <p className="mt-4 text-base font-medium text-zinc-600 dark:text-zinc-400">{t.decisionsEmpty}</p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
        {t.noDecisionsIdentified}
      </p>
    </div>
  );
}

// Decisions and actions panel
function DecisionsPanel({ 
  participants, 
  decisions, 
  actionItems, 
  t 
}: { 
  participants: string[];
  decisions: string[];
  actionItems: { description: string; owner: string | null }[];
  t: ReturnType<typeof useI18n>["t"];
}) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const items = listRef.current?.querySelectorAll("[data-list-item]");
    if (items) {
      gsap.fromTo(
        items,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out", stagger: 0.05 }
      );
    }
  }, []);

  if (!participants?.length && !decisions?.length && !actionItems?.length) {
    return <EmptyDecisions t={t} />;
  }

  return (
    <div ref={listRef} className="space-y-6">
      {/* Participants */}
      {participants?.length > 0 && (
        <div data-list-item className="rounded-xl border border-zinc-200/60 bg-zinc-50/50 p-4 dark:border-zinc-800/60 dark:bg-zinc-800/30">
          <div className="flex items-center gap-2 mb-3">
            <HiUsers className="h-5 w-5 text-indigo-500" />
            <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">{t.participants}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {participants.map((p, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-300"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Decisions */}
      {decisions?.length > 0 && (
        <div data-list-item>
          <div className="flex items-center gap-2 mb-3">
            <HiCheckCircle className="h-5 w-5 text-emerald-500" />
            <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">{t.decisions}</h3>
          </div>
          <ul className="space-y-2">
            {decisions.map((d, i) => (
              <li
                key={i}
                data-list-item
                className="flex items-start gap-3 rounded-xl border border-emerald-200/60 bg-emerald-50/50 p-3 dark:border-emerald-800/40 dark:bg-emerald-950/20"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                  <HiCheckCircle className="h-3 w-3" />
                </span>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Items */}
      {actionItems?.length > 0 && (
        <div data-list-item>
          <div className="flex items-center gap-2 mb-3">
            <HiClipboardDocumentList className="h-5 w-5 text-violet-500" />
            <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">{t.actionItems}</h3>
          </div>
          <ul className="space-y-2">
            {actionItems.map((a, i) => (
              <li
                key={i}
                data-list-item
                className="flex items-start gap-3 rounded-xl border border-violet-200/60 bg-violet-50/50 p-3 dark:border-violet-800/40 dark:bg-violet-950/20"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{a.description}</p>
                  {a.owner ? (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                      <HiUsers className="h-3 w-3" />
                      {a.owner}
                    </span>
                  ) : (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {t.ownerUnassigned}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Input mode toggle (Upload vs Record)
function InputModeToggle({
  mode,
  onChange,
  disabled,
  t,
}: {
  mode: "upload" | "record";
  onChange: (mode: "upload" | "record") => void;
  disabled?: boolean;
  t: ReturnType<typeof useI18n>["t"];
}) {
  return (
    <div className="mb-4 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange("upload")}
        disabled={disabled}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
          mode === "upload"
            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <HiCloudArrowUp className="h-4 w-4" />
        {t.uploadLabel}
      </button>
      <span className="text-sm text-zinc-400 dark:text-zinc-500">
        {mode === "upload" ? t.orRecordMeeting : t.orUploadFile}
      </span>
      <button
        type="button"
        onClick={() => onChange("record")}
        disabled={disabled}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
          mode === "record"
            ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <HiMicrophone className="h-4 w-4" />
        {t.recordMeeting}
      </button>
    </div>
  );
}

export function NewMeeting() {
  const { t } = useI18n();
  const { add, markExport } = useHistory();
  const { checkLimit, incrementUsage, usage, isAuthenticated } = useAuthContext();
  
  // Destructure usage for display
  const used = usage.usedToday;
  const limit = usage.dailyLimit;
  
  const [file, setFile] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState<"upload" | "record">("upload");
  const [outputLang, setOutputLangState] = useState<string>(() => getOutputLanguage());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [result, setResult] = useState<ApiResult | null>(null);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [limitReached, setLimitReached] = useState<{ isRegistered: boolean; limit: number } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const analyzed = !!result;
  const canAnalyze = !!file && !loading && !limitReached;
  const canExport = !!file && !loading && analyzed;

  const handleOutputLang = useCallback((value: string) => {
    setOutputLangState(value);
    setOutputLanguage(value as "en" | "he" | "fr" | "es" | "ar");
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!file) return;

    // Check usage limit before proceeding
    const limitStatus = checkLimit();
    if (!limitStatus.canProceed) {
      setLimitReached({ isRegistered: limitStatus.isRegistered, limit: limitStatus.limit });
      return;
    }

    setError(null);
    setResult(null);
    setLimitReached(null);
    setLoading(true);
    setStatus(t.loading);
    
    try {
      const data = await analyzeMeeting(file, outputLang);
      
      // Increment usage after successful analysis
      incrementUsage();
      
      setResult(data);
      setStatus(t.done);
      const entry = add({
        createdAt: new Date().toISOString(),
        fileName: file.name,
        outputLanguage: outputLang,
        summary: data.analysis.summary,
        transcriptRaw: data.transcript,
        transcriptClean: data.analysis.translated_transcript,
        participants: data.analysis.participants ?? [],
        decisions: data.analysis.decisions ?? [],
        actionItems: (data.analysis.action_items ?? []).map((a) => ({
          description: a.description,
          owner: a.owner ?? null,
        })),
        exports: { word: false, pdf: false },
      });
      setCurrentHistoryId(entry.id);

      // Scroll to results
      setTimeout(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        resultsRef.current?.scrollIntoView({ 
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start"
        });
      }, 100);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.error);
      setStatus("");
    } finally {
      setLoading(false);
    }
  }, [file, outputLang, t.loading, t.done, t.error, add, checkLimit, incrementUsage]);

  const runExport = useCallback(
    async (format: "word" | "pdf") => {
      if (!file) return;
      setError(null);
      setLoading(true);
      setStatus(t.exporting);
      const fn = format === "word" ? exportWord : exportPdf;
      const msg = format === "word" ? t.toastWordDownloaded : t.toastPdfDownloaded;
      try {
        await fn(file, outputLang);
        setToast({ type: "success", message: msg });
        if (currentHistoryId) markExport(currentHistoryId, format);
      } catch (e) {
        setToast({ type: "error", message: e instanceof Error ? e.message : t.error });
      } finally {
        setLoading(false);
        setStatus("");
      }
    },
    [file, outputLang, currentHistoryId, t.exporting, t.toastWordDownloaded, t.toastPdfDownloaded, t.error, markExport]
  );

  // Clear limit message when user registers
  useEffect(() => {
    if (isAuthenticated && limitReached && !limitReached.isRegistered) {
      setLimitReached(null);
    }
  }, [isAuthenticated, limitReached]);

  const tabs: TabItem[] = result
    ? [
        {
          id: "summary",
          label: t.summary,
          icon: HiSparkles,
          panel: <SummaryCard summary={result.analysis.summary || t.none} t={t} bare />,
        },
        {
          id: "clean",
          label: t.cleanTranscript,
          icon: HiDocumentText,
          panel: (
            <div>
              <p className="mb-4 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <HiLanguage className="h-4 w-4" />
                {t.cleanTranscriptLabel}
              </p>
              <div className="max-h-[500px] space-y-3 overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-200/60 bg-zinc-50/50 px-5 py-5 text-base leading-relaxed text-zinc-700 dark:border-zinc-700/60 dark:bg-zinc-800/50 dark:text-zinc-300">
                {result.analysis.translated_transcript?.trim() || t.none}
              </div>
            </div>
          ),
        },
        {
          id: "original",
          label: t.originalTranscript,
          panel: (
            <div>
              <p
                className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400"
                title={t.originalTranscriptTooltip}
              >
                <HiExclamationCircle className="h-4 w-4 text-amber-500" />
                {t.originalTranscript}
                <span className="text-xs text-zinc-400 dark:text-zinc-500">— {t.rawTranscriptionNote}</span>
              </p>
              <pre
                className="max-h-[500px] overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-200/60 bg-zinc-100/80 px-5 py-4 text-sm leading-relaxed text-zinc-600 dark:border-zinc-700/60 dark:bg-zinc-800/80 dark:text-zinc-400"
                title={t.originalTranscriptTooltip}
              >
                {result.transcript?.trim() || t.none}
              </pre>
            </div>
          ),
        },
        {
          id: "decisions",
          label: t.decisionsActions,
          icon: HiClipboardDocumentList,
          panel: (
            <DecisionsPanel
              participants={result.analysis.participants ?? []}
              decisions={result.analysis.decisions ?? []}
              actionItems={(result.analysis.action_items ?? []).map((a) => ({
                description: a.description,
                owner: a.owner ?? null,
              }))}
              t={t}
            />
          ),
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Usage limit banner */}
      {limitReached && (
        <UsageLimitBanner
          isRegistered={limitReached.isRegistered}
          limit={limitReached.limit}
          onSignUp={() => setShowAuthModal(true)}
          t={t}
        />
      )}

      {/* Step 1: Upload or Record */}
      <section>
        <div className="mb-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">1</span>
            {t.uploadLabel}
          </h2>
        </div>
        
        {/* Input mode toggle */}
        <InputModeToggle 
          mode={inputMode}
          onChange={setInputMode}
          disabled={loading || !!file}
          t={t}
        />
        
        {/* Upload zone */}
        {inputMode === "upload" && (
          <UploadZone 
            onSelect={setFile} 
            disabled={loading} 
            hint={t.uploadHint}
            selectedFile={file}
          />
        )}
        
        {/* Recording zone */}
        {inputMode === "record" && (
          <AudioRecorder
            onRecordingComplete={setFile}
            onCancel={() => setFile(null)}
            disabled={loading}
            t={{
              startRecording: t.startRecording,
              stopRecording: t.stopRecording,
              recording: t.recording,
              recordingInProgress: t.recordingInProgress,
              deleteRecording: t.deleteRecording,
              useRecording: t.useRecording,
              recordingNotSupported: t.recordingNotSupported,
              microphonePermissionDenied: t.microphonePermissionDenied,
            }}
          />
        )}
      </section>

      {/* Step 2: Language Selection */}
      <section>
        <div className="mb-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500 to-sky-600 text-sm font-bold text-white">2</span>
            {t.outputLanguage}
          </h2>
        </div>
        <OutputLanguageSelector 
          value={outputLang} 
          onChange={handleOutputLang} 
          disabled={loading}
        />
      </section>

      {/* Step 3: Actions */}
      <section>
        <div className="mb-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white">3</span>
            {analyzed ? t.yourResults : t.analyze}
          </h2>
        </div>

        {/* Loading State */}
        {loading && !result ? (
          <div className="rounded-2xl border border-zinc-200/60 bg-white/80 shadow-lg backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/80">
            <AnalyzingLoader message={status || t.loading} hint={t.processingAudio} />
          </div>
        ) : (
          <>
            <ActionButtons
              canAnalyze={canAnalyze}
              canExport={canExport}
              onAnalyze={handleAnalyze}
              onExportWord={() => runExport("word")}
              onExportPdf={() => runExport("pdf")}
              t={t}
              used={used}
              limit={limit}
            />

            {/* Error State */}
            {error && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
                  <HiExclamationCircle className="h-5 w-5" />
                </span>
                <p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Results */}
      {tabs.length > 0 && (
        <section ref={resultsRef} className="scroll-mt-8">
          <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} aria-label="Result tabs" />
        </section>
      )}

      {/* Toast */}
      {toast && (
        <Toast type={toast.type} message={toast.message} onDismiss={() => setToast(null)} />
      )}

      {/* Auth modal (login/register) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setLimitReached(null)}
      />
    </div>
  );
}
