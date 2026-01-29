/**
 * Premium toast notification with GSAP animation.
 * Success or error states with smooth enter/exit animations.
 */

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { HiCheckCircle, HiXCircle, HiXMark } from "react-icons/hi2";

type ToastType = "success" | "error";

interface ToastProps {
  type: ToastType;
  message: string;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ type, message, onDismiss, duration = 5000 }: ToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const isSuccess = type === "success";

  const handleDismiss = useCallback(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (prefersReducedMotion) {
      onDismiss();
      return;
    }

    gsap.to(toastRef.current, {
      opacity: 0,
      x: 20,
      duration: 0.3,
      ease: "power2.in",
      onComplete: onDismiss,
    });
  }, [onDismiss]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (!prefersReducedMotion) {
      // Enter animation
      gsap.fromTo(
        toastRef.current,
        { opacity: 0, x: 50, scale: 0.9 },
        { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    }

    // Auto dismiss
    const timer = setTimeout(handleDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, handleDismiss]);

  return (
    <div
      ref={toastRef}
      role="alert"
      className={`fixed bottom-6 end-6 z-50 flex max-w-sm items-center gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-sm ${
        isSuccess
          ? "border-emerald-200/60 bg-emerald-50/95 dark:border-emerald-800/60 dark:bg-emerald-950/95"
          : "border-red-200/60 bg-red-50/95 dark:border-red-900/60 dark:bg-red-950/95"
      }`}
    >
      {/* Icon */}
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          isSuccess
            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
            : "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400"
        }`}
      >
        {isSuccess ? (
          <HiCheckCircle className="h-5 w-5" />
        ) : (
          <HiXCircle className="h-5 w-5" />
        )}
      </span>

      {/* Message */}
      <p
        className={`flex-1 text-sm font-medium ${
          isSuccess
            ? "text-emerald-800 dark:text-emerald-200"
            : "text-red-800 dark:text-red-200"
        }`}
      >
        {message}
      </p>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={handleDismiss}
        className={`shrink-0 cursor-pointer rounded-lg p-1.5 transition-colors duration-200 ${
          isSuccess
            ? "text-emerald-600 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
            : "text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50"
        }`}
        aria-label="Dismiss"
      >
        <HiXMark className="h-5 w-5" />
      </button>
    </div>
  );
}
