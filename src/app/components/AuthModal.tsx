/**
 * AuthModal: Combined login/register modal with real authentication.
 * 
 * Features:
 * - Register: firstName, lastName, email, password, confirmPassword
 * - Login: email, password
 * - Fully i18n compliant
 * - Centered, accessible modal with GSAP animations
 * - Guest meeting migration on register
 * 
 * Layout:
 * - Fixed full-screen overlay (inset-0)
 * - Centered card (flex items-center justify-center)
 * - Scrollable content (max-h-[90vh] overflow-y-auto)
 * - Responsive padding
 */

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { 
  HiSparkles, 
  HiXMark, 
  HiUser, 
  HiEnvelope, 
  HiCheckCircle,
  HiLockClosed,
  HiEye,
  HiEyeSlash,
} from "react-icons/hi2";
import { useAuthContext, isValidEmail, type RegisterPayload, type LoginPayload } from "../context/AuthContext";
import { useI18n } from "../hooks/useI18n";

type AuthView = "register" | "login";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialView?: AuthView;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export function AuthModal({ isOpen, onClose, onSuccess, initialView = "register" }: AuthModalProps) {
  const { register, login } = useAuthContext();
  const { t } = useI18n();
  
  const [view, setView] = useState<AuthView>(initialView);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Reset form when view changes
  useEffect(() => {
    setErrors({});
    setPassword("");
    setConfirmPassword("");
  }, [view]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
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
    const newErrors: FormErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = t.authErrorFirstNameRequired;
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = t.authErrorNameMin;
    }

    if (!lastName.trim()) {
      newErrors.lastName = t.authErrorLastNameRequired;
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = t.authErrorNameMin;
    }

    if (!email.trim()) {
      newErrors.email = t.authErrorEmailRequired;
    } else if (!isValidEmail(email)) {
      newErrors.email = t.authErrorEmailInvalid;
    }

    if (!password) {
      newErrors.password = t.authErrorPasswordRequired;
    } else if (password.length < 6) {
      newErrors.password = t.authErrorPasswordMin;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t.authErrorConfirmPasswordRequired;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t.authErrorPasswordsNoMatch;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [firstName, lastName, email, password, confirmPassword, t]);

  const validateLogin = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = t.authErrorEmailRequired;
    } else if (!isValidEmail(email)) {
      newErrors.email = t.authErrorEmailInvalid;
    }

    if (!password) {
      newErrors.password = t.authErrorPasswordRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password, t]);

  const handleRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateRegister()) return;

      setIsSubmitting(true);
      setErrors({});
      
      try {
        const payload: RegisterPayload = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
          confirmPassword,
        };
        
        const result = await register(payload);
        
        if (result.success) {
          onSuccess?.();
          handleClose();
        } else {
          setErrors({ general: result.error || t.authErrorGeneral });
        }
      } catch (e) {
        setErrors({ general: t.authErrorGeneral });
      } finally {
        setIsSubmitting(false);
      }
    },
    [firstName, lastName, email, password, confirmPassword, validateRegister, register, onSuccess, handleClose, t]
  );

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateLogin()) return;

      setIsSubmitting(true);
      setErrors({});
      
      try {
        const payload: LoginPayload = {
          email: email.trim(),
          password,
        };
        
        const result = await login(payload);
        
        if (result.success) {
          onSuccess?.();
          handleClose();
        } else {
          setErrors({ general: result.error || t.authErrorInvalidCredentials });
        }
      } catch (e) {
        setErrors({ general: t.authErrorGeneral });
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, password, validateLogin, login, onSuccess, handleClose, t]
  );

  const clearFieldError = useCallback((field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex min-h-screen cursor-pointer items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md max-h-[90vh] cursor-default overflow-y-auto rounded-2xl border border-zinc-200/60 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-900/95"
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
            className="absolute end-4 top-4 cursor-pointer rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label="Close"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* General error */}
          {errors.general && (
            <div className="mb-4 rounded-xl border border-red-200/60 bg-red-50/50 p-3 dark:border-red-800/40 dark:bg-red-950/20">
              <p className="text-sm text-red-700 dark:text-red-400">{errors.general}</p>
            </div>
          )}

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
              {/* Name fields row */}
              <div className="mb-4 grid grid-cols-2 gap-3">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="auth-firstName"
                    className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    {t.authFirstName}
                  </label>
                  <div className="relative">
                    <span className="absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <HiUser className="h-5 w-5" />
                    </span>
                    <input
                      ref={firstInputRef}
                      id="auth-firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        clearFieldError("firstName");
                      }}
                      placeholder={t.authFirstNamePlaceholder}
                      className={`w-full rounded-xl border bg-white py-3 pe-4 ps-10 text-base text-zinc-800 placeholder-zinc-400 transition-all duration-200 focus:outline-none focus:ring-2 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500 ${
                        errors.firstName
                          ? "border-red-300 focus:border-red-400 focus:ring-red-400/30 dark:border-red-700"
                          : "border-zinc-200 focus:border-indigo-400 focus:ring-indigo-400/30 dark:border-zinc-700"
                      }`}
                      autoComplete="given-name"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="auth-lastName"
                    className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    {t.authLastName}
                  </label>
                  <div className="relative">
                    <span className="absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <HiUser className="h-5 w-5" />
                    </span>
                    <input
                      id="auth-lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        clearFieldError("lastName");
                      }}
                      placeholder={t.authLastNamePlaceholder}
                      className={`w-full rounded-xl border bg-white py-3 pe-4 ps-10 text-base text-zinc-800 placeholder-zinc-400 transition-all duration-200 focus:outline-none focus:ring-2 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500 ${
                        errors.lastName
                          ? "border-red-300 focus:border-red-400 focus:ring-red-400/30 dark:border-red-700"
                          : "border-zinc-200 focus:border-indigo-400 focus:ring-indigo-400/30 dark:border-zinc-700"
                      }`}
                      autoComplete="family-name"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email field */}
              <div className="mb-4">
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
                      clearFieldError("email");
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

              {/* Password field */}
              <div className="mb-4">
                <label
                  htmlFor="auth-password-register"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {t.authPassword}
                </label>
                <div className="relative">
                  <span className="absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <HiLockClosed className="h-5 w-5" />
                  </span>
                  <input
                    id="auth-password-register"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearFieldError("password");
                    }}
                    placeholder={t.authPasswordPlaceholder}
                    className={`w-full rounded-xl border bg-white py-3 pe-12 ps-10 text-base text-zinc-800 placeholder-zinc-400 transition-all duration-200 focus:outline-none focus:ring-2 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500 ${
                      errors.password
                        ? "border-red-300 focus:border-red-400 focus:ring-red-400/30 dark:border-red-700"
                        : "border-zinc-200 focus:border-indigo-400 focus:ring-indigo-400/30 dark:border-zinc-700"
                    }`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {showPassword ? <HiEyeSlash className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password field */}
              <div className="mb-6">
                <label
                  htmlFor="auth-confirmPassword"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {t.authConfirmPassword}
                </label>
                <div className="relative">
                  <span className="absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <HiLockClosed className="h-5 w-5" />
                  </span>
                  <input
                    id="auth-confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearFieldError("confirmPassword");
                    }}
                    placeholder={t.authConfirmPasswordPlaceholder}
                    className={`w-full rounded-xl border bg-white py-3 pe-12 ps-10 text-base text-zinc-800 placeholder-zinc-400 transition-all duration-200 focus:outline-none focus:ring-2 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500 ${
                      errors.confirmPassword
                        ? "border-red-300 focus:border-red-400 focus:ring-red-400/30 dark:border-red-700"
                        : "border-zinc-200 focus:border-indigo-400 focus:ring-indigo-400/30 dark:border-zinc-700"
                    }`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {showConfirmPassword ? <HiEyeSlash className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-600 hover:to-violet-700 hover:shadow-xl hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed dark:focus:ring-offset-zinc-900"
              >
                {isSubmitting ? t.loading : t.authSubmitRegister}
              </button>
            </form>
          )}

          {/* Login Form */}
          {view === "login" && (
            <form onSubmit={handleLogin}>
              {/* Email field */}
              <div className="mb-4">
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
                      clearFieldError("email");
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

              {/* Password field */}
              <div className="mb-6">
                <label
                  htmlFor="auth-password-login"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {t.authPassword}
                </label>
                <div className="relative">
                  <span className="absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <HiLockClosed className="h-5 w-5" />
                  </span>
                  <input
                    id="auth-password-login"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearFieldError("password");
                    }}
                    placeholder={t.authPasswordPlaceholder}
                    className={`w-full rounded-xl border bg-white py-3 pe-12 ps-10 text-base text-zinc-800 placeholder-zinc-400 transition-all duration-200 focus:outline-none focus:ring-2 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500 ${
                      errors.password
                        ? "border-red-300 focus:border-red-400 focus:ring-red-400/30 dark:border-red-700"
                        : "border-zinc-200 focus:border-indigo-400 focus:ring-indigo-400/30 dark:border-zinc-700"
                    }`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {showPassword ? <HiEyeSlash className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-600 hover:to-violet-700 hover:shadow-xl hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed dark:focus:ring-offset-zinc-900"
              >
                {isSubmitting ? t.loading : t.authSubmitLogin}
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
                  className="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
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
                  className="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {t.authSignUp}
                </button>
              </p>
            )}
          </div>

          {/* Privacy note */}
          <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
            {t.authSecurityNote}
          </p>
        </div>
      </div>
    </div>
  );
}
