/**
 * Theme toggle: Light / Dark only. Sun (light) / Moon (dark).
 * Smooth GSAP animated transition with rotation and scale.
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { HiMoon, HiSun } from "react-icons/hi2";
import type { Theme } from "../lib/storage";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
  disabled?: boolean;
  "aria-label"?: string;
}

export function ThemeToggle({
  theme,
  onToggle,
  disabled,
  "aria-label": ariaLabel = "Toggle theme",
}: ThemeToggleProps) {
  const isDark = theme === "dark";
  const iconRef = useRef<HTMLSpanElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const icon = iconRef.current;
    if (!icon) return;

    gsap.fromTo(
      icon,
      { rotate: isDark ? -90 : 90, scale: 0.5, opacity: 0 },
      { rotate: 0, scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
    );
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={isDark}
      className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-zinc-200/50 bg-white/80 backdrop-blur-sm text-zinc-600 transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-60 dark:border-zinc-700/50 dark:bg-zinc-800/80 dark:text-zinc-400 dark:hover:border-violet-500/50 dark:hover:bg-violet-900/20 dark:hover:text-violet-400 dark:focus:ring-offset-zinc-950"
    >
      <span ref={iconRef} className="flex items-center justify-center">
        {isDark ? (
          <HiMoon className="h-5 w-5" />
        ) : (
          <HiSun className="h-5 w-5" />
        )}
      </span>
      {/* Glow effect on hover */}
      <span className="absolute inset-0 rounded-xl bg-linear-to-r from-indigo-500/0 via-indigo-500/0 to-violet-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 dark:group-hover:opacity-20" />
    </button>
  );
}
