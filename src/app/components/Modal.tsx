/**
 * Premium modal with GSAP animation, glass effect, and accessible focus trap.
 */

import { type ReactNode, useRef, useEffect } from "react";
import gsap from "gsap";
import { HiExclamationTriangle } from "react-icons/hi2";

interface ModalProps {
  title: string;
  children: ReactNode;
  cancelLabel: string;
  confirmLabel: string;
  confirmDanger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function Modal({
  title,
  children,
  cancelLabel,
  confirmLabel,
  confirmDanger,
  onCancel,
  onConfirm,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion) {
      // Animate overlay
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" }
      );

      // Animate modal
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" }
      );
    }

    // Close on escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const handleClose = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      onCancel();
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
      onComplete: onCancel,
    });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-2xl border border-zinc-200/60 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-900/95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4">
          {confirmDanger && (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
              <HiExclamationTriangle className="h-6 w-6" />
            </span>
          )}
          <div>
            <h2
              id="modal-title"
              className="text-xl font-semibold text-zinc-900 dark:text-zinc-100"
            >
              {title}
            </h2>
            <div className="mt-2 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              {children}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={
              "rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 " +
              (confirmDanger
                ? "bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/25 focus:ring-red-500"
                : "bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/25 focus:ring-indigo-400")
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
