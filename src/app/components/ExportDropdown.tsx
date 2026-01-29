/**
 * Premium export dropdown with GSAP animations.
 * Uses Floating UI for viewport-aware positioning.
 * Supports Word and PDF export options.
 * 
 * Features:
 * - Auto-flips when near viewport edges
 * - RTL-aware positioning
 * - Mobile safe areas respected
 * - Keyboard navigation support
 */

import React, { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
  FloatingPortal,
  type Placement,
} from "@floating-ui/react";
import { HiChevronDown, HiArrowDownTray, HiDocumentText } from "react-icons/hi2";
import { PDF_EXPORT_ENABLED } from "../lib/constants";
import { useLanguage } from "../context/LanguageContext";
import type { I18nStrings } from "../lib/i18n";

interface ExportDropdownProps {
  disabled: boolean;
  t: Pick<I18nStrings, "export" | "exportWord" | "exportPdf">;
  onExportWord: () => void;
  onExportPdf: () => void;
}

export function ExportDropdown({ disabled, t, onExportWord, onExportPdf }: ExportDropdownProps) {
  const { isRTL } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLSpanElement>(null);

  // Determine placement based on RTL
  const placement: Placement = isRTL ? "bottom-start" : "bottom-end";

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(8),
      // Flip to opposite side if not enough space
      flip({
        fallbackAxisSideDirection: "start",
        padding: 8,
      }),
      // Shift along axis if still not enough space
      shift({
        padding: 8,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "menu" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const close = useCallback(() => setIsOpen(false), []);

  // Animate dropdown
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const menu = menuRef.current;
    const chevron = chevronRef.current;

    if (isOpen && menu && !prefersReducedMotion) {
      gsap.fromTo(
        menu,
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "back.out(1.7)" }
      );
    }

    if (chevron && !prefersReducedMotion) {
      gsap.to(chevron, {
        rotate: isOpen ? 180 : 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isOpen]);

  const handleWord = useCallback(() => {
    close();
    onExportWord();
  }, [close, onExportWord]);

  const handlePdf = useCallback(() => {
    close();
    onExportPdf();
  }, [close, onExportPdf]);

  return (
    <div className="relative inline-block">
      <button
        ref={refs.setReference}
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="export-menu"
        id="export-button"
        className="group inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-zinc-200/60 bg-white/80 px-3 py-2 text-sm font-medium text-zinc-700 backdrop-blur-sm transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-zinc-200/60 disabled:hover:bg-white/80 disabled:hover:text-zinc-700 disabled:hover:shadow-none dark:border-zinc-700/60 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 dark:focus:ring-offset-zinc-950 sm:gap-2 sm:px-5 sm:py-3"
        {...getReferenceProps()}
      >
        <HiArrowDownTray className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
        <span className="hidden xs:inline">{t.export}</span>
        <span ref={chevronRef}>
          <HiChevronDown className="h-4 w-4 shrink-0" />
        </span>
      </button>

      {isOpen && (
        <FloatingPortal root={typeof document !== "undefined" ? document.getElementById("overlay-root") ?? undefined : undefined}>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={(node) => {
                refs.setFloating(node);
                menuRef.current = node;
              }}
              id="export-menu"
              role="menu"
              aria-labelledby="export-button"
              style={{ ...floatingStyles, position: "fixed" }}
              className="z-50 min-w-[200px] rounded-xl border border-zinc-200/60 bg-white/95 py-2 shadow-xl backdrop-blur-xl dark:border-zinc-700/60 dark:bg-zinc-800/95 sm:min-w-[220px]"
              {...getFloatingProps()}
            >
            <button
              type="button"
              role="menuitem"
              onClick={handleWord}
              className="group flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-start text-sm text-zinc-700 transition-all duration-200 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none dark:text-zinc-200 dark:hover:bg-indigo-950/30 dark:focus:bg-indigo-950/30 sm:gap-3 sm:px-4 sm:py-3"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-transform duration-200 group-hover:scale-110 dark:bg-blue-900/40 dark:text-blue-400 sm:h-9 sm:w-9">
                <HiDocumentText className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <div>
                <p className="font-medium">{t.exportWord}</p>
                <p className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:block">Microsoft Word (.docx)</p>
              </div>
            </button>

            {PDF_EXPORT_ENABLED && (
              <button
                type="button"
                role="menuitem"
                onClick={handlePdf}
                className="group flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-start text-sm text-zinc-700 transition-all duration-200 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none dark:text-zinc-200 dark:hover:bg-indigo-950/30 dark:focus:bg-indigo-950/30 sm:gap-3 sm:px-4 sm:py-3"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600 transition-transform duration-200 group-hover:scale-110 dark:bg-red-900/40 dark:text-red-400 sm:h-9 sm:w-9">
                  <HiDocumentText className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <div>
                  <p className="font-medium">{t.exportPdf}</p>
                  <p className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:block">PDF Document (.pdf)</p>
                </div>
              </button>
            )}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
}
