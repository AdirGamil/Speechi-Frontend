/**
 * Shared navbar: logo (→ /), user menu, language selector, theme toggle.
 * Logo has GSAP hover animation with scale and glow effect.
 * Shows user state: Guest (sign up button) or Registered (avatar + dropdown).
 * All text is i18n compliant - updates immediately on language change.
 * User menu uses Floating UI for viewport-aware positioning.
 */

import React, { useRef, useCallback, useEffect } from "react";
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
import { useNavigate, usePathname } from "../lib/router";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { AuthModal } from "./AuthModal";
import { useI18n } from "../hooks/useI18n";
import { useTheme } from "../hooks/useTheme";
import { useAuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
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
  const { isRTL } = useLanguage();
  
  // Destructure usage for display
  const { usedToday: used, dailyLimit: limit } = usage;
  
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  
  const logoRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLSpanElement>(null);

  // Determine placement based on RTL
  const placement: Placement = isRTL ? "bottom-start" : "bottom-end";

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open: showUserMenu,
    onOpenChange: setShowUserMenu,
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
  const dismiss = useDismiss(context, { outsidePressEvent: "click" });
  const role = useRole(context, { role: "menu" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  // Animate dropdown and chevron
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dropdown = dropdownRef.current;
    const chevron = chevronRef.current;

    if (showUserMenu && dropdown && !prefersReducedMotion) {
      gsap.fromTo(
        dropdown,
        { y: -8, scale: 0.97 },
        { y: 0, scale: 1, duration: 0.2, ease: "power2.out" }
      );
    }

    if (chevron && !prefersReducedMotion) {
      gsap.to(chevron, {
        rotate: showUserMenu ? 180 : 0,
        duration: 0.3,
        ease: "power2.out",
      });
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
          "flex flex-nowrap items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4 " + className
        }
      >
        {/* Logo */}
        <button
          ref={logoRef}
          type="button"
          onClick={() => navigate("/")}
          onMouseEnter={handleLogoEnter}
          onMouseLeave={handleLogoLeave}
          className="group relative flex shrink-0 cursor-pointer items-center gap-2 text-xl font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
        >
          {/* Logo icon */}
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-indigo-500/40 sm:h-9 sm:w-9">
            <svg 
              className="h-4 w-4 sm:h-5 sm:w-5" 
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
          {/* Logo text - hidden on very small screens */}
          <span className="hidden bg-linear-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-400 xs:inline sm:inline">
            Speechi
          </span>
          {/* Underline animation on hover */}
          <span className="absolute -bottom-1 left-10 h-0.5 w-0 bg-linear-to-r from-indigo-500 to-violet-500 transition-all duration-300 group-hover:w-[calc(100%-2.5rem)] sm:left-11 sm:group-hover:w-[calc(100%-2.75rem)]" />
        </button>

        {/* Right side controls */}
        <div className="flex flex-nowrap items-center gap-1.5 sm:gap-3">
          {/* Usage indicator (only in app) - shows USED/LIMIT format */}
          {isInApp && (
            <div className="hidden items-center gap-1.5 rounded-lg bg-zinc-100/80 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-400 sm:flex sm:px-2.5 sm:py-1.5">
              <HiSparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>{t.usageIndicator.replace("{used}", String(used)).replace("{limit}", String(limit))}</span>
            </div>
          )}

          <LanguageSelector value={lang} onChange={setLang} aria-label={t.selectLanguage} />
          <ThemeToggle theme={theme} onToggle={toggleTheme} aria-label={t.toggleTheme} />

          {/* User menu */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                ref={refs.setReference}
                type="button"
                className="group flex cursor-pointer items-center gap-1 rounded-xl border border-zinc-200/50 bg-white/80 px-2 py-1.5 backdrop-blur-sm transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 dark:border-zinc-700/50 dark:bg-zinc-800/80 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/30 sm:gap-2 sm:px-3 sm:py-2"
                aria-expanded={showUserMenu}
                aria-haspopup="true"
                {...getReferenceProps()}
              >
                {/* Avatar */}
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white sm:h-7 sm:w-7">
                  {initials}
                </span>
                <span className="hidden text-sm font-medium text-zinc-700 dark:text-zinc-300 md:inline">
                  {t.authWelcome.replace("{name}", user.name.split(" ")[0] || "")}
                </span>
                <span ref={chevronRef} className="flex items-center">
                  <HiChevronDown className="h-3.5 w-3.5 text-zinc-400 transition-colors group-hover:text-indigo-500 dark:group-hover:text-violet-400 sm:h-4 sm:w-4" />
                </span>
              </button>

              {/* Dropdown menu with Floating UI (portal for iOS / z-index) */}
              {showUserMenu && (
                <FloatingPortal root={typeof document !== "undefined" ? document.getElementById("overlay-root") ?? undefined : undefined}>
                  <FloatingFocusManager context={context} modal={false}>
                    <div
                      ref={(node) => {
                        refs.setFloating(node);
                        dropdownRef.current = node;
                      }}
                      style={{ ...floatingStyles, position: "fixed" }}
                      className="z-50 min-w-[180px] rounded-xl border border-zinc-200/60 bg-white/95 py-2 shadow-xl backdrop-blur-xl dark:border-zinc-700/60 dark:bg-zinc-900/95 sm:min-w-[200px]"
                      {...getFloatingProps()}
                    >
                    {/* User info */}
                    <div className="border-b border-zinc-200/60 px-3 py-2 dark:border-zinc-700/60 sm:px-4 sm:py-3">
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
                        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:gap-3 sm:px-4 sm:py-2.5"
                      >
                        <HiClock className="h-4 w-4 text-zinc-400" />
                        {t.history}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNavigation("/app/settings")}
                        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:gap-3 sm:px-4 sm:py-2.5"
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
                        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 sm:gap-3 sm:px-4 sm:py-2.5"
                      >
                        <HiArrowRightOnRectangle className="h-4 w-4" />
                        {t.authLogout}
                      </button>
                    </div>
                  </div>
                  </FloatingFocusManager>
                </FloatingPortal>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
            >
              <HiSparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">{t.authSignUpFree}</span>
              <span className="xs:hidden">{t.authSignUp}</span>
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
