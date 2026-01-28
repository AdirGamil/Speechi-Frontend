/**
 * AuthModal: Combined login/register modal.
 * No password, no backend - this is a product simulation.
 * 
 * Features:
 * - Register: name + email
 * - Login: email only (matches stored user)
 * - Fully i18n compliant
 * - Centered, accessible modal with GSAP animations
 * 
 * Layout:
 * - Fixed full-screen overlay (inset-0)
 * - Centered card (flex items-center justify-center)
 * - Scrollable content (max-h-[90vh] overflow-y-auto)
 * - Responsive padding
 */

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { HiSparkles, HiXMark, HiUser, HiEnvelope, HiCheckCircle } from "react-icons/hi2";
import { useAuthContext, isValidEmail } from "../context/AuthContext";
import { useI18n } from "../hooks/useI18n";

type AuthView = "register" | "login";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialView?: AuthView;
}

export function AuthModal({ isOpen, onClose, onSuccess, initialView = "register" }: AuthModalProps) {
  const { register, login } = useAuthContext();
  const { t } = useI18n();
  
  const [view, setView] = useState<AuthView>(initialView);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Reset form when view changes
  useEffect(() => {
    setErrors({});
  }, [view]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setName("");
      setEmail("");
      setErrors({});
    }
  }, [isOpen, initialView]);

  // Animation and focus
  useEffect(() => {
    if (!isOpen) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" }
      );
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" }
      );
    }

    // Focus first input
    setTimeout(() => firstInputRef.current?.focus(), 100);

    // Close on escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      onClose();
      return;
    }

    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 10,
      duration: 0.2,
      ease: "power2.in",
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: onClose,
    });
  }, [onClose]);

  const validateRegister = useCallback((): boolean => {
    const newErrors: { name?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = t.authErrorNameRequired;
    } else if (name.trim().length < 2) {
      newErrors.name = t.authErrorNameMin;
    }

    if (!email.trim()) {
      newErrors.email = t.authErrorEmailRequired;
    } else if (!isValidEmail(email)) {
      newErrors.email = t.authErrorEmailInvalid;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, t]);

  const validateLogin = useCallback((): boolean => {
    const newErrors: { email?: string } = {};

    if (!email.trim()) {
      newErrors.email = t.authErrorEmailRequired;
    } else if (!isValidEmail(email)) {
      newErrors.email = t.authErrorEmailInvalid;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, t]);

  const handleRegister = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateRegister()) return;

      setIsSubmitting(true);
      
      // Simulate a brief delay for UX
      setTimeout(() => {
        register(name.trim(), email.trim());
        setIsSubmitting(false);
        setName("");
        setEmail("");
        setErrors({});
        onSuccess?.();
        handleClose();
      }, 300);
    },
    [name, email, validateRegister, register, onSuccess, handleClose]
  );

  const handleLogin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateLogin()) return;

      setIsSubmitting(true);
      
      // Simulate a brief delay for UX
      setTimeout(() => {
        const result = login(email.trim());
        setIsSubmitting(false);
        
        if (result.success) {
          setEmail("");
          setErrors({});
          onSuccess?.();
          handleClose();
        } else {
          setErrors({ email: t.authErrorUserNotFound });
        }
      }, 300);
    },
    [email, validateLogin, login, onSuccess, handleClose, t]
  );

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed top-0 left-0 right-0 bottom-0 z-50 flex min-h-screen items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200/60 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-900/95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative border-b border-zinc-200/60 px-6 py-5 dark:border-zinc-800/60">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white">
              <HiSparkles className="h-6 w-6" />
            </span>
            <div>
              <h2
                id="auth-modal-title"
                className="text-xl font-semibold text-zinc-900 dark:text-zinc-100"
              >
                {view === "register" ? t.authRegisterTitle : t.authLoginTitle}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {view === "register" ? t.authRegisterSubtitle : t.authLoginSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="absolute end-4 top-4 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label="Close"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Benefits (only for register view) */}
          {view === "register" && (
            <div className="mb-6 rounded-xl border border-emerald-200/60 bg-emerald-50/50 p-4 dark:border-emerald-800/40 dark:bg-emerald-950/20">
              <h3 className="mb-2 text-sm font-medium text-emerald-800 dark:text-emerald-300">
                {t.authBenefitsTitle}
              </h3>
              <ul className="space-y-1.5 text-sm text-emerald-700 dark:text-emerald-400">
                <li className="flex items-center gap-2">
                  <HiCheckCircle className="h-4 w-4 shrink-0" />
                  {t.authBenefit1}
                </li>
                <li className="flex items-center gap-2">
                  <HiCheckCircle className="h-4 w-4 shrink-0" />
                  {t.authBenefit2}
                </li>
                <li className="flex items-center gap-2">
                  <HiCheckCircle className="h-4 w-4 shrink-0" />
                  {t.authBenefit3}
                </li>
              </ul>
            </div>
          )}

          {/* Register Form */}
          {view === "register" && (
            <form onSubmit={handleRegister}>
              {/* Name field */}
              <div className="mb-4">
                <label
                  htmlFor="auth-name"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {t.authName}
                </label>
                <div className="relative">
                  <span className="absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <HiUser className="h-5 w-5" />
                  </span>
                  <input
                    ref={firstInputRef}
                    id="auth-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder={t.authNamePlaceholder}
                    className={`w-full rounded-xl border bg-white py-3 pe-4 ps-10 text-base text-zinc-800 placeholder-zinc-400 transition-all duration-200 focus:outline-none focus:ring-2 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500 ${
                      errors.name
                        ? "border-red-300 focus:border-red-400 focus:ring-red-400/30 dark:border-red-700"
                        : "border-zinc-200 focus:border-indigo-400 focus:ring-indigo-400/30 dark:border-zinc-700"
                    }`}
                    autoComplete="name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Email field */}
              <div className="mb-6">
                <label
                  htmlFor="auth-email-register"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {t.authEmail}
                </label>
                <div className="relative">
                  <span className="absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <HiEnvelope className="h-5 w-5" />
                  </span>
                  <input
                    id="auth-email-register"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder={t.authEmailPlaceholder}
                    className={`w-full rounded-xl border bg-white py-3 pe-4 ps-10 text-base text-zinc-800 placeholder-zinc-400 transition-all duration-200 focus:outline-none focus:ring-2 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500 ${
                      errors.email
                        ? "border-red-300 focus:border-red-400 focus:ring-red-400/30 dark:border-red-700"
                        : "border-zinc-200 focus:border-indigo-400 focus:ring-indigo-400/30 dark:border-zinc-700"
                    }`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-600 hover:to-violet-700 hover:shadow-xl hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed dark:focus:ring-offset-zinc-900"
              >
                {isSubmitting ? "..." : t.authSubmitRegister}
              </button>
            </form>
          )}

          {/* Login Form */}
          {view === "login" && (
            <form onSubmit={handleLogin}>
              {/* Email field */}
              <div className="mb-6">
                <label
                  htmlFor="auth-email-login"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {t.authEmail}
                </label>
                <div className="relative">
                  <span className="absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <HiEnvelope className="h-5 w-5" />
                  </span>
                  <input
                    ref={firstInputRef}
                    id="auth-email-login"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder={t.authEmailPlaceholder}
                    className={`w-full rounded-xl border bg-white py-3 pe-4 ps-10 text-base text-zinc-800 placeholder-zinc-400 transition-all duration-200 focus:outline-none focus:ring-2 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500 ${
                      errors.email
                        ? "border-red-300 focus:border-red-400 focus:ring-red-400/30 dark:border-red-700"
                        : "border-zinc-200 focus:border-indigo-400 focus:ring-indigo-400/30 dark:border-zinc-700"
                    }`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-600 hover:to-violet-700 hover:shadow-xl hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed dark:focus:ring-offset-zinc-900"
              >
                {isSubmitting ? "..." : t.authSubmitLogin}
              </button>
            </form>
          )}

          {/* Switch view link */}
          <div className="mt-4 text-center">
            {view === "register" ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {t.authHaveAccount}{" "}
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {t.authLogin}
                </button>
              </p>
            ) : (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {t.authNoAccount}{" "}
                <button
                  type="button"
                  onClick={() => setView("register")}
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {t.authSignUp}
                </button>
              </p>
            )}
          </div>

          {/* Privacy note */}
          <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
            {t.authPrivacyNote}
          </p>
        </div>
      </div>
    </div>
  );
}
