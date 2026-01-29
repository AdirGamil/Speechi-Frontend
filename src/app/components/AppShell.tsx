/**
 * App shell: premium design with glass navbar, GSAP mount animation,
 * and smooth navigation with active indicator.
 */

import { type ReactNode, useRef, useEffect } from "react";
import gsap from "gsap";
import { useNavigate, usePathname } from "../lib/router";
import { Navbar } from "./Navbar";
import { useI18n } from "../hooks/useI18n";
import { HiMicrophone, HiClock, HiCog6Tooth } from "react-icons/hi2";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const path = usePathname();
  const navigate = useNavigate();
  const { t, rtl } = useI18n();
  const mainRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const nav = [
    { path: "/app" as const, label: t.newMeeting, icon: HiMicrophone },
    { path: "/app/history" as const, label: t.history, icon: HiClock },
    { path: "/app/settings" as const, label: t.settings, icon: HiCog6Tooth },
  ];

  // GSAP mount animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const content = contentRef.current;
    if (content) {
      gsap.fromTo(
        content,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [path]);

  return (
    <div
      className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50 text-zinc-900 transition-colors duration-300 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 dark:text-zinc-100"
      dir={rtl ? "rtl" : "ltr"}
    >
      {/* Header with glass effect */}
      <header className="sticky top-0 z-40 glass-navbar border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="mx-auto max-w-5xl">
          <Navbar />
          
          {/* Product navigation */}
          <nav className="flex gap-1 px-4 pb-4 sm:px-6" aria-label="Product">
            {nav.map(({ path: p, label, icon: Icon }) => {
              const active = path === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => navigate(p)}
                  className={
                    "group relative flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 " +
                    (active
                      ? "bg-linear-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100")
                  }
                >
                  <Icon className={`h-4 w-4 transition-transform duration-300 ${!active ? 'group-hover:scale-110' : ''}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main content area */}
      <main ref={mainRef} className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div ref={contentRef}>
          {children}
        </div>
      </main>
    </div>
  );
}
