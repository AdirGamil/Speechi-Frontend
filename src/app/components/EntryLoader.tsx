/**
 * Full-screen entry loader. GSAP: logo fade + scale ~500ms, then onComplete.
 * Calm, premium. No spinners.
 */

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface EntryLoaderProps {
  onComplete: () => void;
}

export function EntryLoader({ onComplete }: EntryLoaderProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const logo = logoRef.current;
      if (!logo) return;

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          onComplete();
        },
      });

      tl.fromTo(logo, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.25 })
        .to(logo, { opacity: 0, duration: 0.2 }, "+=0.05");
    },
    { scope: wrapRef, dependencies: [onComplete] }
  );

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-zinc-950"
      aria-hidden="true"
    >
      <div
        ref={logoRef}
        className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl"
      >
        Speechi
      </div>
    </div>
  );
}
