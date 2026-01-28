/**
 * UI language selector: emoji flags + native language name.
 * GSAP animated dropdown open/close. Updates all UI via LanguageContext.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { HiChevronDown } from "react-icons/hi2";
import type { UiLang } from "../lib/i18n";

const OPTIONS: { value: UiLang; label: string; flag: string }[] = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "he", label: "עברית", flag: "🇮🇱" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "ar", label: "العربية", flag: "🇸🇦" },
];

interface LanguageSelectorProps {
  value: UiLang;
  onChange: (v: UiLang) => void;
  disabled?: boolean;
  "aria-label"?: string;
}

export function LanguageSelector({
  value,
  onChange,
  disabled,
  "aria-label": ariaLabel = "UI language",
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const chevronRef = useRef<HTMLSpanElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Handle click outside and escape key
  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // GSAP animation for dropdown
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dropdown = dropdownRef.current;
    const chevron = chevronRef.current;

    if (prefersReducedMotion) return;

    if (open && dropdown) {
      gsap.fromTo(
        dropdown,
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "back.out(1.7)" }
      );
      // Stagger items
      const items = dropdown.querySelectorAll("li");
      gsap.fromTo(
        items,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.2, stagger: 0.03, ease: "power2.out", delay: 0.1 }
      );
    }

    if (chevron) {
      gsap.to(chevron, {
        rotate: open ? 180 : 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [open]);

  const current = OPTIONS.find((o) => o.value === value)!;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className="group inline-flex items-center gap-2 rounded-xl border border-zinc-200/50 bg-white/80 backdrop-blur-sm px-3 py-2 text-sm font-medium text-zinc-700 transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60 dark:border-zinc-700/50 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:border-violet-500/50 dark:hover:bg-violet-900/20 dark:focus:ring-violet-500"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <span ref={chevronRef} className="flex items-center">
          <HiChevronDown className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-indigo-500 dark:group-hover:text-violet-400" />
        </span>
      </button>
      {open && (
        <ul
          ref={dropdownRef}
          role="listbox"
          className="absolute end-0 top-full z-50 mt-2 min-w-[180px] rounded-xl border border-zinc-200/50 bg-white/95 backdrop-blur-xl py-2 shadow-xl dark:border-zinc-700/50 dark:bg-zinc-900/95"
        >
          {OPTIONS.map((o) => {
            const selected = o.value === value;
            return (
              <li key={o.value} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    close();
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-start text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-400 ${
                    selected
                      ? "bg-linear-to-r from-indigo-50 to-violet-50 font-medium text-indigo-600 dark:from-indigo-900/30 dark:to-violet-900/30 dark:text-indigo-400"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
                  }`}
                >
                  <span className="text-lg leading-none">{o.flag}</span>
                  <span>{o.label}</span>
                  {selected && (
                    <span className="ms-auto text-indigo-500 dark:text-indigo-400">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
