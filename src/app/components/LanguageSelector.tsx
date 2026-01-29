/**
 * UI language selector: emoji flags + native language name.
 * Uses Floating UI with FloatingPortal (renders to document.body) so the
 * dropdown appears below the trigger and is not clipped by overflow.
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
  useListNavigation,
  FloatingFocusManager,
  FloatingPortal,
  type Placement,
} from "@floating-ui/react";
import { HiChevronDown } from "react-icons/hi2";
import type { UiLang } from "../lib/i18n";
import { useLanguage } from "../context/LanguageContext";

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
  const { isRTL } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);
  const chevronRef = useRef<HTMLSpanElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const placement: Placement = isRTL ? "bottom-start" : "bottom-end";

  const { refs, floatingStyles, context } = useFloating({
    placement,
    strategy: "fixed",
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(8),
      flip({ fallbackAxisSideDirection: "start", padding: 8 }),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, { outsidePressEvent: "click" });
  const role = useRole(context, { role: "listbox" });
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    role,
    listNav,
  ]);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dropdown = dropdownRef.current;
    const chevron = chevronRef.current;

    if (prefersReducedMotion) return;

    if (isOpen && dropdown) {
      gsap.fromTo(dropdown, { y: -8, scale: 0.97 }, { y: 0, scale: 1, duration: 0.2, ease: "power2.out" });
      const items = dropdown.querySelectorAll("li");
      gsap.fromTo(
        items,
        { opacity: 0, x: isRTL ? 10 : -10 },
        { opacity: 1, x: 0, duration: 0.2, stagger: 0.03, ease: "power2.out", delay: 0.1 }
      );
    }
    if (chevron) {
      gsap.to(chevron, { rotate: isOpen ? 180 : 0, duration: 0.3, ease: "power2.out" });
    }
  }, [isOpen, isRTL]);

  const current = OPTIONS.find((o) => o.value === value)!;

  return (
    <>
      <button
        ref={refs.setReference}
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className="group inline-flex cursor-pointer items-center gap-1 rounded-xl border border-zinc-200/50 bg-white/80 px-2 py-1.5 text-sm font-medium text-zinc-700 backdrop-blur-sm transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60 dark:border-zinc-700/50 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:border-violet-500/50 dark:hover:bg-violet-900/20 dark:focus:ring-violet-500 sm:gap-2 sm:px-3 sm:py-2"
        {...getReferenceProps()}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <span ref={chevronRef} className="flex items-center">
          <HiChevronDown className="h-3.5 w-3.5 text-zinc-400 transition-colors group-hover:text-indigo-500 dark:group-hover:text-violet-400 sm:h-4 sm:w-4" />
        </span>
      </button>

      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <ul
              ref={(node) => {
                refs.setFloating(node);
                dropdownRef.current = node;
              }}
              role="listbox"
              aria-activedescendant={activeIndex != null ? `lang-option-${OPTIONS[activeIndex].value}` : undefined}
              style={floatingStyles}
              className="z-50 min-w-[160px] rounded-xl border border-zinc-200/50 bg-white/95 py-2 shadow-xl backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-900/95 sm:min-w-[180px]"
              {...getFloatingProps()}
            >
              {OPTIONS.map((o, index) => {
                const selected = o.value === value;
                const isActive = activeIndex === index;
                return (
                  <li
                    key={o.value}
                    id={`lang-option-${o.value}`}
                    role="option"
                    aria-selected={selected}
                    ref={(node) => {
                      listRef.current[index] = node;
                    }}
                    tabIndex={isActive ? 0 : -1}
                    className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-start text-sm transition-all duration-200 focus:outline-none sm:gap-3 sm:px-4 sm:py-2.5 ${
                      selected
                        ? "bg-linear-to-r from-indigo-50 to-violet-50 font-medium text-indigo-600 dark:from-indigo-900/30 dark:to-violet-900/30 dark:text-indigo-400"
                        : isActive
                          ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300"
                          : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
                    }`}
                    {...getItemProps({
                      onClick: () => {
                        onChange(o.value);
                        close();
                      },
                      onKeyDown: (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onChange(o.value);
                          close();
                        }
                      },
                    })}
                  >
                    <span className="text-base leading-none sm:text-lg">{o.flag}</span>
                    <span>{o.label}</span>
                    {selected && (
                      <span className="ms-auto text-indigo-500 dark:text-indigo-400">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
