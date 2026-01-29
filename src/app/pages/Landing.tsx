/**
 * Landing (marketing). Premium redesign with GSAP animations.
 * All content from copy via getLandingCopy(language).
 * Features: Hero with animated background, scroll-triggered sections,
 * parallax effects, FAQ accordion, premium cards.
 */

import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  HiCheckCircle,
  HiChevronDown,
  HiMicrophone,
  HiSparkles,
  HiDocumentText,
  HiClock,
  HiGlobeAlt,
  HiShare,
  HiUsers,
  HiChatBubbleLeftRight,
  HiPresentationChartBar,
  HiClipboardDocumentList,
  HiBuildingOffice2,
  HiRocketLaunch,
  HiUserGroup,
  HiLightBulb,
  HiMagnifyingGlass,
  HiArrowPath,
  HiShieldCheck,
  HiCpuChip,
} from "react-icons/hi2";
import { useNavigate } from "../lib/router";
import { Navbar } from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";
import { getLandingCopy, type LandingLang } from "../copy/landingCopy";
import { useI18n } from "../hooks/useI18n";

const HERO_WORDS_ID = "hero-title-word";
const HERO_WORDS_SELECTOR = `[id^="${HERO_WORDS_ID}-"]`;

// Benefit icons mapping
const BENEFIT_ICONS = [HiUsers, HiSparkles, HiDocumentText, HiShare, HiGlobeAlt];

// Use case icons mapping
const USE_CASE_ICONS = [
  HiUsers,
  HiChatBubbleLeftRight,
  HiPresentationChartBar,
  HiBuildingOffice2,
  HiRocketLaunch,
  HiUserGroup,
];

// Feature icons mapping
const FEATURE_ICONS = [HiLightBulb, HiMagnifyingGlass, HiArrowPath, HiShieldCheck, HiCpuChip, HiClock];

function HeroTitleWords({ title }: { title: string }) {
  const words = title.trim().split(/\s+/).filter(Boolean);
  return (
    <h1
      id="hero-title"
      className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
      aria-hidden={false}
    >
      {words.map((w, i) => (
        <span 
          key={i} 
          id={`${HERO_WORDS_ID}-${i}`} 
          className="inline-block bg-linear-to-r from-zinc-900 via-zinc-800 to-zinc-900 bg-clip-text text-transparent dark:from-white dark:via-zinc-200 dark:to-white"
        >
          {w}{" "}
        </span>
      ))}
    </h1>
  );
}

// Animated background blobs
function HeroBackground() {
  const blobsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const blobs = blobsRef.current?.querySelectorAll(".blob");
    blobs?.forEach((blob, i) => {
      gsap.to(blob, {
        y: `${20 + i * 10}`,
        x: `${10 + i * 5}`,
        duration: 6 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  }, { scope: blobsRef });

  return (
    <div ref={blobsRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient blob */}
      <div className="blob absolute -top-40 -right-40 h-96 w-96 rounded-full bg-linear-to-br from-indigo-400/30 to-violet-400/30 blur-3xl dark:from-indigo-600/20 dark:to-violet-600/20" />
      <div className="blob absolute top-1/3 -left-32 h-72 w-72 rounded-full bg-linear-to-br from-cyan-400/20 to-sky-400/20 blur-3xl dark:from-cyan-600/15 dark:to-sky-600/15" />
      <div className="blob absolute bottom-20 right-1/4 h-64 w-64 rounded-full bg-linear-to-br from-violet-400/20 to-purple-400/20 blur-3xl dark:from-violet-600/15 dark:to-purple-600/15" />
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50 dark:opacity-30" />
    </div>
  );
}

// Parallax decorative elements
function ParallaxElements() {
  const elementsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const elements = elementsRef.current?.querySelectorAll(".parallax-el");
    elements?.forEach((el, i) => {
      gsap.to(el, {
        y: `-=${50 + i * 30}`,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });
  }, { scope: elementsRef });

  return (
    <div ref={elementsRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="parallax-el absolute top-[30%] left-[10%] h-3 w-3 rounded-full bg-indigo-400/40 dark:bg-indigo-500/30" />
      <div className="parallax-el absolute top-[45%] right-[15%] h-2 w-2 rounded-full bg-violet-400/40 dark:bg-violet-500/30" />
      <div className="parallax-el absolute top-[60%] left-[20%] h-4 w-4 rounded-full bg-cyan-400/30 dark:bg-cyan-500/20" />
      <div className="parallax-el absolute top-[75%] right-[25%] h-2 w-2 rounded-full bg-indigo-400/40 dark:bg-indigo-500/30" />
    </div>
  );
}

// FAQ Item component with GSAP accordion
function FAQItem({ question, answer, isOpen, onToggle }: { 
  question: string; 
  answer: string; 
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const content = contentRef.current;
    const chevron = chevronRef.current;

    if (content) {
      if (prefersReducedMotion) {
        content.style.height = isOpen ? "auto" : "0px";
      } else {
        if (isOpen) {
          gsap.to(content, {
            height: "auto",
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        } else {
          gsap.to(content, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
          });
        }
      }
    }

    if (chevron && !prefersReducedMotion) {
      gsap.to(chevron, {
        rotate: isOpen ? 180 : 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isOpen]);

  return (
    <div className="group rounded-2xl border border-zinc-200/60 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-900/80 dark:hover:border-violet-800/50">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl p-5 text-start focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-400"
        aria-expanded={isOpen}
      >
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 sm:text-lg">
          {question}
        </h3>
        <span ref={chevronRef} className="shrink-0 text-zinc-400 transition-colors group-hover:text-indigo-500 dark:group-hover:text-violet-400">
          <HiChevronDown className="h-5 w-5" />
        </span>
      </button>
      <div ref={contentRef} className="faq-content h-0 opacity-0 overflow-hidden">
        <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
          {answer}
        </p>
      </div>
    </div>
  );
}

export function Landing() {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const { t } = useI18n();
  const copy = getLandingCopy(language as LandingLang);
  const heroRef = useRef<HTMLElement>(null);
  const benefitsRef = useRef<HTMLElement>(null);
  const comparisonRef = useRef<HTMLElement>(null);
  const useCasesRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = useCallback((index: number) => {
    setOpenFAQ(prev => prev === index ? null : index);
  }, []);

  // Smooth scroll to app section
  const scrollToApp = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      navigate("/app");
      return;
    }
    navigate("/app");
  };

  /* GSAP: Hero — stagger title, subtitle fade-up, CTAs last. */
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const words = heroRef.current?.querySelectorAll(HERO_WORDS_SELECTOR);
      const subtitle = heroRef.current?.querySelector("#hero-subtitle");
      const ctaPrimary = heroRef.current?.querySelector("#hero-cta-primary");
      const ctaSecondary = heroRef.current?.querySelector("#hero-cta-secondary");
      const badge = heroRef.current?.querySelector("#hero-badge");
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      if (badge) {
        tl.fromTo(badge, { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5 });
      }
      if (words?.length) {
        tl.fromTo(words, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, "-=0.2");
      }
      if (subtitle) {
        tl.fromTo(subtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
      }
      if (ctaPrimary) {
        tl.fromTo(ctaPrimary, { opacity: 0, y: 15, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.4 }, "-=0.2");
      }
      if (ctaSecondary) {
        tl.fromTo(ctaSecondary, { opacity: 0, y: 15, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.4 }, "-=0.3");
      }
    },
    { scope: heroRef, dependencies: [] }
  );

  /* GSAP: Benefits — scroll-triggered stagger. */
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const cards = benefitsRef.current?.querySelectorAll("[data-benefit-card]");
      const title = benefitsRef.current?.querySelector("[data-section-title]");
      
      if (title) {
        ScrollTrigger.create({
          trigger: title,
          start: "top 85%",
          onEnter: () => {
            gsap.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
          },
          once: true,
        });
      }
      
      if (!cards?.length) return;
      ScrollTrigger.create({
        trigger: benefitsRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
          );
        },
        once: true,
      });
    },
    { scope: benefitsRef, dependencies: [] }
  );

  /* GSAP: Comparison section */
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const cards = comparisonRef.current?.querySelectorAll("[data-comparison-card]");
      if (!cards?.length) return;

      ScrollTrigger.create({
        trigger: comparisonRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(
            cards,
            { opacity: 0, x: (i) => (i === 0 ? -40 : 40) },
            { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" }
          );
        },
        once: true,
      });
    },
    { scope: comparisonRef, dependencies: [] }
  );

  /* GSAP: Use Cases section */
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const cards = useCasesRef.current?.querySelectorAll("[data-usecase-card]");
      if (!cards?.length) return;

      ScrollTrigger.create({
        trigger: useCasesRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" }
          );
        },
        once: true,
      });
    },
    { scope: useCasesRef, dependencies: [] }
  );

  /* GSAP: How It Works section */
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const steps = howItWorksRef.current?.querySelectorAll("[data-step]");
      if (!steps?.length) return;

      steps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 85%",
          onEnter: () => {
            gsap.fromTo(
              step,
              { opacity: 0, x: i % 2 === 0 ? -30 : 30 },
              { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
            );
          },
          once: true,
        });
      });
    },
    { scope: howItWorksRef, dependencies: [] }
  );

  /* GSAP: Features section */
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const cards = featuresRef.current?.querySelectorAll("[data-feature-card]");
      if (!cards?.length) return;

      ScrollTrigger.create({
        trigger: featuresRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
          );
        },
        once: true,
      });
    },
    { scope: featuresRef, dependencies: [] }
  );

  // Generic scroll-triggered animation for sections
  const animatedSectionRef = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    ScrollTrigger.create({
      trigger: node,
      start: "top 85%",
      onEnter: () => {
        gsap.fromTo(
          node,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
      },
      once: true,
    });
  }, []);

  const sectionClass =
    "rounded-3xl border border-zinc-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-zinc-800/60 dark:bg-zinc-900/80 sm:p-8";
  const headingClass = "text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl";
  const bodyClass = "mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400";

  return (
    <div
      className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50 text-zinc-900 transition-colors duration-300 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 dark:text-zinc-100"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-navbar border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="mx-auto max-w-6xl">
          <Navbar />
        </div>
      </header>

      {/* Hero Section - Full viewport height */}
      <section 
        ref={heroRef} 
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        <HeroBackground />
        <ParallaxElements />
        
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          {/* Badge */}
          <div 
            id="hero-badge"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-200/50 bg-indigo-50/80 px-4 py-2 text-sm font-medium text-indigo-700 backdrop-blur-sm dark:border-indigo-800/50 dark:bg-indigo-900/30 dark:text-indigo-300"
          >
            <HiSparkles className="h-4 w-4" />
            <span>{t.heroBadge}</span>
          </div>
          
          {/* Title */}
          <HeroTitleWords title={copy.hero.title} />
          
          {/* Subtitle */}
          <p 
            id="hero-subtitle" 
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-xl"
          >
            {copy.hero.subtitle}
          </p>
          
          {/* CTAs */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              id="hero-cta-primary"
              type="button"
              onClick={scrollToApp}
              className="btn-primary cursor-pointer rounded-2xl px-8 py-4 text-base font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 sm:text-lg"
            >
              {copy.hero.ctaPrimary}
            </button>
            <a
              id="hero-cta-secondary"
              href="#how-it-works"
              className="btn-secondary cursor-pointer rounded-2xl border border-zinc-200/60 bg-white/80 backdrop-blur-sm px-8 py-4 text-base font-semibold text-zinc-700 hover:border-indigo-200 hover:bg-indigo-50/50 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 dark:border-zinc-700/60 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:border-violet-700/50 dark:hover:bg-violet-900/20 dark:focus:ring-zinc-500 dark:focus:ring-offset-zinc-950 sm:text-lg"
            >
              {copy.hero.ctaSecondary}
            </a>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-zinc-400">
            <span className="text-xs tracking-wide uppercase">{t.scrollIndicator}</span>
            <HiChevronDown className="h-5 w-5" />
          </div>
        </div>
      </section>

      <main className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        {/* Value statement */}
        <section ref={animatedSectionRef} className={`-mt-12 ${sectionClass} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-linear-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/10 dark:to-violet-900/10" />
          <p className={`relative ${bodyClass} text-center text-lg sm:text-xl`}>{copy.valueStatement.text}</p>
        </section>

        {/* Core benefits */}
        <section ref={benefitsRef} className="mt-24">
          <h2 data-section-title className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            {copy.benefitsTitle}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {copy.benefits.map((b, i) => {
              const Icon = BENEFIT_ICONS[i] || HiCheckCircle;
              return (
                <div
                  key={i}
                  data-benefit-card
                  className="card-hover border-gradient group rounded-2xl border border-zinc-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/80"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:-translate-y-1">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{b.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Manual vs AI comparison */}
        <section ref={comparisonRef} className="mt-24">
          <h2 data-section-title className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            {copy.comparisonTitle}
          </h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {/* Manual */}
            <div 
              data-comparison-card
              className={`${sectionClass} relative overflow-hidden border-red-200/50 dark:border-red-900/30`}
            >
              <div className="absolute inset-0 bg-linear-to-br from-red-50/30 to-orange-50/30 dark:from-red-900/10 dark:to-orange-900/10" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
                    <HiClipboardDocumentList className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {copy.comparisonManualTitle}
                  </h3>
                </div>
                <ul className="mt-5 space-y-3">
                  {copy.comparison.manual.map((line, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-400">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* AI */}
            <div 
              data-comparison-card
              className={`${sectionClass} relative overflow-hidden border-emerald-200/50 dark:border-emerald-900/30`}
            >
              <div className="absolute inset-0 bg-linear-to-br from-emerald-50/30 to-cyan-50/30 dark:from-emerald-900/10 dark:to-cyan-900/10" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                    <HiSparkles className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {copy.comparisonAiTitle}
                  </h3>
                </div>
                <ul className="mt-5 space-y-3">
                  {copy.comparison.ai.map((line, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-500 dark:bg-emerald-900/40 dark:text-emerald-400">
                        <HiCheckCircle className="h-3.5 w-3.5" />
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Productivity */}
        <section ref={animatedSectionRef} className={`mt-24 ${sectionClass} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-linear-to-br from-indigo-50/30 to-cyan-50/30 dark:from-indigo-900/10 dark:to-cyan-900/10" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white">
                <HiRocketLaunch className="h-5 w-5" />
              </span>
              <h2 className={headingClass}>{copy.productivity.title}</h2>
            </div>
            {copy.productivity.paragraphs.map((p, i) => (
              <p key={i} className={bodyClass}>{p}</p>
            ))}
          </div>
        </section>

        {/* Action items */}
        <section ref={animatedSectionRef} className={`mt-24 ${sectionClass} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-linear-to-br from-violet-50/30 to-purple-50/30 dark:from-violet-900/10 dark:to-purple-900/10" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-purple-600 text-white">
                <HiClipboardDocumentList className="h-5 w-5" />
              </span>
              <h2 className={headingClass}>{copy.actionItems.title}</h2>
            </div>
            <p className={bodyClass}>{copy.actionItems.description}</p>
            <p className="mt-6 inline-block rounded-xl bg-indigo-50/80 px-4 py-2 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              {copy.actionItems.takeaway}
            </p>
          </div>
        </section>

        {/* Memory */}
        <section ref={animatedSectionRef} className={`mt-24 ${sectionClass} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-linear-to-br from-cyan-50/30 to-sky-50/30 dark:from-cyan-900/10 dark:to-sky-900/10" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 to-sky-600 text-white">
                <HiMagnifyingGlass className="h-5 w-5" />
              </span>
              <h2 className={headingClass}>{copy.memory.title}</h2>
            </div>
            {copy.memory.paragraphs.map((p, i) => (
              <p key={i} className={bodyClass}>{p}</p>
            ))}
          </div>
        </section>

        {/* Remote teams */}
        <section ref={animatedSectionRef} className={`mt-24 ${sectionClass} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-linear-to-br from-emerald-50/30 to-teal-50/30 dark:from-emerald-900/10 dark:to-teal-900/10" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 text-white">
                <HiGlobeAlt className="h-5 w-5" />
              </span>
              <h2 className={headingClass}>{copy.remote.title}</h2>
            </div>
            {copy.remote.paragraphs.map((p, i) => (
              <p key={i} className={bodyClass}>{p}</p>
            ))}
          </div>
        </section>

        {/* Use cases */}
        <section ref={useCasesRef} className="mt-24">
          <h2 data-section-title className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            {copy.useCasesTitle}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {copy.useCases.map((u, i) => {
              const Icon = USE_CASE_ICONS[i] || HiUsers;
              return (
                <div
                  key={i}
                  data-usecase-card
                  className="card-hover border-gradient group rounded-2xl border border-zinc-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/80"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-indigo-100 to-violet-100 text-indigo-600 transition-transform duration-300 group-hover:-translate-y-1 dark:from-indigo-900/40 dark:to-violet-900/40 dark:text-indigo-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {u.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{u.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" ref={howItWorksRef} className="mt-24 scroll-mt-24">
          <h2 data-section-title className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            {copy.howItWorksTitle}
          </h2>
          <div className="mt-12 space-y-6">
            {copy.howItWorks.map((step, i) => {
              const StepIcon = [HiMicrophone, HiCpuChip, HiDocumentText][i] || HiCheckCircle;
              return (
                <div
                  key={step.step}
                  data-step
                  className={`${sectionClass} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-50/30 via-transparent to-violet-50/30 dark:from-indigo-900/10 dark:via-transparent dark:to-violet-900/10" />
                  <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <div className="flex items-center gap-4">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white shadow-lg shadow-indigo-500/25">
                        {step.step}
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 sm:hidden dark:bg-indigo-900/40 dark:text-indigo-400">
                        <StepIcon className="h-5 w-5" />
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="hidden h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 sm:flex dark:bg-indigo-900/40 dark:text-indigo-400">
                          <StepIcon className="h-5 w-5" />
                        </span>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {step.title}
                        </h3>
                      </div>
                      <p className={`mt-2 ${bodyClass}`}>{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Advanced features */}
        <section ref={featuresRef} className="mt-24">
          <h2 data-section-title className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            {copy.featuresTitle}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {copy.features.map((f, i) => {
              const Icon = FEATURE_ICONS[i] || HiSparkles;
              return (
                <div
                  key={i}
                  data-feature-card
                  className="card-hover border-gradient group rounded-2xl border border-zinc-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/80"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-violet-100 to-purple-100 text-violet-600 transition-transform duration-300 group-hover:-translate-y-1 dark:from-violet-900/40 dark:to-purple-900/40 dark:text-violet-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{f.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-24">
          <h2 className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            {copy.faqTitle}
          </h2>
          <div className="mt-12 space-y-4 mx-auto max-w-3xl">
            {copy.faq.map((q, i) => (
              <FAQItem 
                key={i}
                question={q.question}
                answer={q.answer}
                isOpen={openFAQ === i}
                onToggle={() => toggleFAQ(i)}
              />
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section ref={animatedSectionRef} className="mt-24 relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-violet-600 to-purple-600" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
          <div className="relative px-6 py-16 text-center sm:px-12 sm:py-20">
            <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">{copy.finalCta.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-indigo-100 sm:text-lg">{copy.finalCta.subtitle}</p>
            <div className="mt-10">
              <button
                type="button"
                onClick={() => navigate("/app")}
                className="cursor-pointer rounded-2xl bg-white px-8 py-4 text-base font-semibold text-indigo-600 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:text-lg"
              >
                {copy.finalCta.button}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/50 bg-white/50 backdrop-blur-sm py-8 dark:border-zinc-800/50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} Speechi. {t.footerCopyright}
          </p>
        </div>
      </footer>
    </div>
  );
}
