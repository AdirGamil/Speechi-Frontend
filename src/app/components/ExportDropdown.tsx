/**
 * Premium export dropdown with GSAP animations.
 * Supports Word and PDF export options.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { HiChevronDown, HiArrowDownTray, HiDocumentText } from "react-icons/hi2";
import { PDF_EXPORT_ENABLED } from "../lib/constants";
import type { I18nStrings } from "../lib/i18n";

interface ExportDropdownProps {
  disabled: boolean;
  t: Pick<I18nStrings, "export" | "exportWord" | "exportPdf">;
  onExportWord: () => void;
  onExportPdf: () => void;
}

export function ExportDropdown({ disabled, t, onExportWord, onExportPdf }: ExportDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLSpanElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      close();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, close]);

  // Animate dropdown
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const menu = menuRef.current;
    const chevron = chevronRef.current;

    if (open && menu && !prefersReducedMotion) {
      gsap.fromTo(
        menu,
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "back.out(1.7)" }
      );
    }

    if (chevron && !prefersReducedMotion) {
      gsap.to(chevron, {
        rotate: open ? 180 : 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [open]);

  const handleWord = useCallback(() => {
    close();
    onExportWord();
  }, [close, onExportWord]);

  const handlePdf = useCallback(() => {
    close();
    onExportPdf();
  }, [close, onExportPdf]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="export-menu"
        id="export-button"
        className="group inline-flex items-center gap-2 rounded-xl border border-zinc-200/60 bg-white/80 px-5 py-3 text-sm font-medium text-zinc-700 backdrop-blur-sm transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:border-zinc-200/60 disabled:hover:bg-white/80 disabled:hover:text-zinc-700 disabled:hover:shadow-none dark:border-zinc-700/60 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 dark:focus:ring-offset-zinc-950"
      >
        <HiArrowDownTray className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
        {t.export}
        <span ref={chevronRef}>
          <HiChevronDown className="h-4 w-4 shrink-0" />
        </span>
      </button>

      {open && (
        <div
          ref={menuRef}
          id="export-menu"
          role="menu"
          aria-labelledby="export-button"
          className="absolute end-0 top-full z-40 mt-2 min-w-[220px] rounded-xl border border-zinc-200/60 bg-white/95 py-2 shadow-xl backdrop-blur-xl dark:border-zinc-700/60 dark:bg-zinc-800/95"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleWord}
            className="group flex w-full items-center gap-3 px-4 py-3 text-start text-sm text-zinc-700 transition-all duration-200 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none dark:text-zinc-200 dark:hover:bg-indigo-950/30 dark:focus:bg-indigo-950/30"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-transform duration-200 group-hover:scale-110 dark:bg-blue-900/40 dark:text-blue-400">
              <HiDocumentText className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium">{t.exportWord}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Microsoft Word (.docx)</p>
            </div>
          </button>

          {PDF_EXPORT_ENABLED && (
            <button
              type="button"
              role="menuitem"
              onClick={handlePdf}
              className="group flex w-full items-center gap-3 px-4 py-3 text-start text-sm text-zinc-700 transition-all duration-200 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none dark:text-zinc-200 dark:hover:bg-indigo-950/30 dark:focus:bg-indigo-950/30"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600 transition-transform duration-200 group-hover:scale-110 dark:bg-red-900/40 dark:text-red-400">
                <HiDocumentText className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium">{t.exportPdf}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">PDF Document (.pdf)</p>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
