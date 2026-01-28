/**
 * Premium accessible tabs with GSAP animated content transitions.
 * Animated underline indicator and smooth content fade.
 */

import { type ReactNode, useRef, useEffect, useState } from "react";
import gsap from "gsap";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  panel: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  "aria-label": string;
}

export function Tabs({ tabs, activeId, onChange, "aria-label": ariaLabel }: TabsProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Mount animation for the container
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setMounted(true);
      return;
    }

    const panel = panelRef.current?.parentElement;
    if (panel) {
      gsap.fromTo(
        panel,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          ease: "power2.out",
          onComplete: () => setMounted(true)
        }
      );
    } else {
      setMounted(true);
    }
  }, []);

  // Animate the active indicator
  useEffect(() => {
    if (!mounted) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    const activeButton = tabsRef.current?.querySelector(`[data-tab-id="${activeId}"]`) as HTMLButtonElement;
    const indicator = indicatorRef.current;
    
    if (activeButton && indicator) {
      const { offsetLeft, offsetWidth } = activeButton;
      
      if (prefersReducedMotion) {
        indicator.style.left = `${offsetLeft}px`;
        indicator.style.width = `${offsetWidth}px`;
      } else {
        gsap.to(indicator, {
          left: offsetLeft,
          width: offsetWidth,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  }, [activeId, mounted, tabs]);

  // Animate panel content on tab change
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const panel = panelRef.current;
    if (panel && mounted) {
      gsap.fromTo(
        panel,
        { opacity: 0, x: 10 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [activeId, mounted]);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/80 shadow-lg backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/80">
      {/* Tab list */}
      <div
        ref={tabsRef}
        role="tablist"
        aria-label={ariaLabel}
        className="relative flex gap-0 border-b border-zinc-200/60 bg-zinc-50/50 px-2 dark:border-zinc-800/60 dark:bg-zinc-800/30"
      >
        {/* Animated indicator */}
        <div
          ref={indicatorRef}
          className="absolute bottom-0 h-0.5 bg-linear-to-r from-indigo-500 to-violet-500 transition-opacity"
          style={{ left: 0, width: 0 }}
        />
        
        {tabs.map((t) => {
          const active = activeId === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              data-tab-id={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active}
              aria-controls={`panel-${t.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(t.id)}
              className={
                "group relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-400 " +
                (active
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200")
              }
            >
              {Icon && (
                <Icon className={`h-4 w-4 transition-transform duration-200 ${!active ? 'group-hover:scale-110' : ''}`} />
              )}
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Tab panel */}
      <div
        ref={panelRef}
        role="tabpanel"
        id={`panel-${activeId}`}
        aria-labelledby={`tab-${activeId}`}
        className="p-6"
      >
        {tabs.find((t) => t.id === activeId)?.panel}
      </div>
    </div>
  );
}
