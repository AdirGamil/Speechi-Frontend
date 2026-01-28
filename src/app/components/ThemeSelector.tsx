/**
 * Theme: Light / Dark / System. Updates useTheme.
 */

import type { Theme } from "../lib/storage";

interface ThemeSelectorProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
  t: { themeLight: string; themeDark: string; themeSystem: string };
  disabled?: boolean;
}

export function ThemeSelector({ theme, setTheme, t, disabled }: ThemeSelectorProps) {
  return (
    <div className="flex rounded-xl border border-zinc-200 bg-white p-0.5 dark:border-zinc-700 dark:bg-zinc-900" role="group" aria-label="Theme">
      {(["light", "dark", "system"] as const).map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => setTheme(opt)}
          disabled={disabled}
          aria-pressed={theme === opt}
          className={
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-60 dark:focus:ring-offset-zinc-950 " +
            (theme === opt
              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100")
          }
        >
          {opt === "light" ? t.themeLight : opt === "dark" ? t.themeDark : t.themeSystem}
        </button>
      ))}
    </div>
  );
}
