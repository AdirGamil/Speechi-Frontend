/**
 * Premium Meeting Summary card with executive-style design.
 * Key insight highlighted, supporting context below.
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { HiSparkles, HiLightBulb } from "react-icons/hi2";
import type { I18nStrings } from "../lib/i18n";

function splitSummary(summary: string): { keyInsight: string; context: string } {
  const t = summary.trim();
  if (!t) return { keyInsight: "", context: "" };
  const sentences = t.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length <= 2) return { keyInsight: sentences.join(" ") || t, context: "" };
  const keyInsight = sentences.slice(0, 2).join(" ");
  const context = sentences.slice(2).join(" ").trim();
  return { keyInsight, context };
}

interface SummaryCardProps {
  summary: string;
  t: Pick<I18nStrings, "summary" | "summarySubtitle" | "summaryNote">;
  /** When true, render content only (no card wrapper). Use inside Tabs. */
  bare?: boolean;
}

export function SummaryCard({ summary, t, bare }: SummaryCardProps) {
  const { keyInsight, context } = splitSummary(summary);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bare) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const card = cardRef.current;
    if (card) {
      gsap.fromTo(
        card,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [bare]);

  const inner = (
    <div ref={bare ? cardRef : undefined}>
      {/* Header */}
      <header className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white">
          <HiSparkles className="h-5 w-5" />
        </span>
        <div>
          <h2
            id="summary-heading"
            className="text-xl font-semibold text-zinc-900 dark:text-zinc-100"
          >
            {t.summary}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.summarySubtitle}</p>
        </div>
      </header>

      {/* Content */}
      <div className="space-y-4">
        {/* Key Insight */}
        {keyInsight && (
          <div className="relative overflow-hidden rounded-xl border border-emerald-200/60 bg-linear-to-br from-emerald-50 to-teal-50 p-5 dark:border-emerald-800/40 dark:from-emerald-950/30 dark:to-teal-950/30">
            <div className="absolute top-3 end-3 text-emerald-200 dark:text-emerald-800">
              <HiLightBulb className="h-8 w-8" />
            </div>
            <p className="relative text-base leading-relaxed text-zinc-800 dark:text-zinc-200">
              {keyInsight}
            </p>
          </div>
        )}

        {/* Supporting Context */}
        {context && (
          <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400 pl-1">
            {context}
          </p>
        )}

        {/* Note */}
        <p className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <HiSparkles className="h-4 w-4 text-indigo-400" />
          {t.summaryNote}
        </p>
      </div>
    </div>
  );

  if (bare) {
    return <div aria-labelledby="summary-heading">{inner}</div>;
  }

  return (
    <section
      className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/80"
      aria-labelledby="summary-heading"
    >
      {inner}
    </section>
  );
}
