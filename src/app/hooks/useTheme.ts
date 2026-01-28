/**
 * Theme: light | dark | system. Persists to localStorage, applies .dark class.
 * 
 * When "system" is selected, follows the OS color scheme preference.
 * Smooth color transition via transition on root.
 */

import { useCallback, useEffect, useState } from "react";
import {
  getTheme,
  setTheme as persistTheme,
  type Theme,
} from "../lib/storage";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return getSystemTheme();
  }
  return theme;
}

function apply(theme: Theme): void {
  const root = document.documentElement;
  const resolved = resolveTheme(theme);
  root.classList.toggle("dark", resolved === "dark");
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => getTheme());

  // Apply theme and persist changes
  useEffect(() => {
    document.documentElement.classList.add("transition-colors", "duration-300");
    apply(theme);
    persistTheme(theme);
  }, [theme]);

  // Listen for system theme changes when in "system" mode
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => apply(theme);
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "system";
      return "light";
    });
  }, []);

  // Resolve the actual displayed theme for components that need it
  const resolvedTheme = resolveTheme(theme);

  return { 
    theme, 
    setTheme, 
    toggleTheme, 
    isDark: resolvedTheme === "dark",
    resolvedTheme,
  };
}

