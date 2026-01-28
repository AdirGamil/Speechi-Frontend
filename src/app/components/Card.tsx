/**
 * Premium card component with glass effect and optional animation.
 */

import { type ReactNode, useRef, useEffect } from "react";
import gsap from "gsap";

interface CardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
}

export function Card({ children, className = "", animate = false, delay = 0 }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const card = cardRef.current;
    if (card) {
      gsap.fromTo(
        card,
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out", delay }
      );
    }
  }, [animate, delay]);

  return (
    <div
      ref={cardRef}
      className={
        "rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-900/80 " +
        className
      }
    >
      {children}
    </div>
  );
}
