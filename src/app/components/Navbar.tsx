/**
 * Shared navbar: logo (→ /), user menu, language selector, theme toggle.
 * Logo has GSAP hover animation with scale and glow effect.
 * Shows user state: Guest (sign up button) or Registered (avatar + dropdown).
 * All text is i18n compliant - updates immediately on language change.
 */

import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useNavigate, usePathname } from "../lib/router";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { AuthModal } from "./AuthModal";
import { useI18n } from "../hooks/useI18n";
import { useTheme } from "../hooks/useTheme";
import { useAuthContext } from "../context/AuthContext";
import {
  HiSparkles,
  HiClock,
  HiCog6Tooth,
  HiArrowRightOnRectangle,
  HiChevronDown,
} from "react-icons/hi2";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className = "" }: NavbarProps) {
  const navigate = useNavigate();
  const path = usePathname();
  const { lang, setLang, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, initials, logout, usage } = useAuthContext();
  
  // Destructure usage for display
  const { usedToday: used, dailyLimit: limit } = usage;
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const logoRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    if (!showUserMenu) return;

    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current?.contains(e.target as Node)) return;
      setShowUserMenu(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowUserMenu(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [showUserMenu]);

  // Animate dropdown
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dropdown = dropdownRef.current;

    if (showUserMenu && dropdown && !prefersReducedMotion) {
      gsap.fromTo(
        dropdown,
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "back.out(1.7)" }
      );
    }
  }, [showUserMenu]);

  const handleLogoEnter = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    gsap.to(logoRef.current, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleLogoLeave = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    gsap.to(logoRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleNavigation = useCallback((to: string) => {
    setShowUserMenu(false);
    navigate(to);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    setShowUserMenu(false);
    logout();
  }, [logout]);

  // Only show in-app features when on /app routes
  const isInApp = path.startsWith("/app");

  return (
    <>
      <nav
        className={
          "flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 " + className
        }
      >
        {/* Logo */}
        <button
          ref={logoRef}
          type="button"
          onClick={() => navigate("/")}
          onMouseEnter={handleLogoEnter}
          onMouseLeave={handleLogoLeave}
          className="group relative flex items-center gap-2 text-xl font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
        >
          {/* Logo icon */}
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-indigo-500/40">
            <svg 
              className="h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </span>
          {/* Logo text */}
          <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-400">
            Speechi
          </span>
          {/* Underline animation on hover */}
          <span className="absolute -bottom-1 left-11 h-0.5 w-0 bg-linear-to-r from-indigo-500 to-violet-500 transition-all duration-300 group-hover:w-[calc(100%-2.75rem)]" />
        </button>

        {/* Right side controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Usage indicator (only in app) - shows USED/LIMIT format */}
          {isInApp && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-zinc-100/80 px-2.5 py-1.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-400">
              <HiSparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>{t.usageIndicator.replace("{used}", String(used)).replace("{limit}", String(limit))}</span>
            </div>
          )}

          <LanguageSelector value={lang} onChange={setLang} aria-label="UI language" />
          <ThemeToggle theme={theme} onToggle={toggleTheme} aria-label="Toggle theme" />

          {/* User menu */}
          {isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="group flex items-center gap-2 rounded-xl border border-zinc-200/50 bg-white/80 px-3 py-2 backdrop-blur-sm transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 dark:border-zinc-700/50 dark:bg-zinc-800/80 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/30"
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                {/* Avatar */}
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                  {initials}
                </span>
                <span className="hidden text-sm font-medium text-zinc-700 dark:text-zinc-300 sm:inline">
                  {t.authWelcome.replace("{name}", user.name.split(" ")[0] || "")}
                </span>
                <HiChevronDown className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div
                  ref={dropdownRef}
                  className="absolute end-0 top-full z-50 mt-2 min-w-[200px] rounded-xl border border-zinc-200/60 bg-white/95 py-2 shadow-xl backdrop-blur-xl dark:border-zinc-700/60 dark:bg-zinc-900/95"
                >
                  {/* User info */}
                  <div className="border-b border-zinc-200/60 px-4 py-3 dark:border-zinc-700/60">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {user.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
                  </div>

                  {/* Navigation items */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => handleNavigation("/app/history")}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <HiClock className="h-4 w-4 text-zinc-400" />
                      {t.history}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNavigation("/app/settings")}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <HiCog6Tooth className="h-4 w-4 text-zinc-400" />
                      {t.settings}
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-zinc-200/60 pt-1 dark:border-zinc-700/60">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <HiArrowRightOnRectangle className="h-4 w-4" />
                      {t.authLogout}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
            >
              <HiSparkles className="h-4 w-4" />
              {t.authSignUpFree}
            </button>
          )}
        </div>
      </nav>

      {/* Auth modal (login/register) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
