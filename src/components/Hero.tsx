"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1200;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [started, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const PRELOADER_QUERY = "Who is Saurabh Sachdev?";

// React-driven pct counter — starts when `active` flips true
function AnimatedPct({ active, duration }: { active: boolean; duration: number }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    if (!active) return;
    const steps = 50;
    const interval = duration / steps;
    let step = 0;
    const t = setInterval(() => {
      step++;
      setPct(Math.round((step / steps) * 100));
      if (step >= steps) clearInterval(t);
    }, interval);
    return () => clearInterval(t);
  }, [active, duration]);
  return <>{pct}%</>;
}

function ColdStartOverlay({ onComplete }: { onComplete: () => void }) {
  // Bar 1: starts 500ms after mount, duration 1800ms → done at 2300ms
  const BAR1_START = 200;
  const BAR1_DUR   = 500;
  const BAR2_START = BAR1_START + BAR1_DUR; // 700
  const BAR2_DUR   = 500;
  const QUERY_START = BAR2_START + BAR2_DUR + 100; // 1300

  const [show, setShow] = useState(true);
  const [bar1Active, setBar1Active] = useState(false);
  const [bar2Active, setBar2Active] = useState(false);
  const [typedQuery, setTypedQuery] = useState("");
  const [queryPhase, setQueryPhase] = useState<"idle" | "typing" | "flying">("idle");
  const queryTyped = typedQuery.length >= PRELOADER_QUERY.length;

  const lines: { text: string; bar?: { active: boolean; duration: number } }[] = [
    { text: "Initializing knowledge base..." },
    { text: "Indexing 4 document collections...", bar: { active: bar1Active, duration: BAR1_DUR } },
    { text: "Loading vector embeddings...",       bar: { active: bar2Active, duration: BAR2_DUR } },
    { text: "Vector store ready." },
    { text: "Awaiting query." },
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setBar1Active(true),  BAR1_START);
    const t2 = setTimeout(() => setBar2Active(true),  BAR2_START);
    const tq = setTimeout(() => setQueryPhase("typing"), QUERY_START);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(tq); };
  }, [BAR1_START, BAR2_START, QUERY_START]);

  // Typewriter
  useEffect(() => {
    if (queryPhase !== "typing") return;
    if (typedQuery.length >= PRELOADER_QUERY.length) {
      const t = setTimeout(() => setQueryPhase("flying"), 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setTypedQuery(PRELOADER_QUERY.slice(0, typedQuery.length + 1)),
      25
    );
    return () => clearTimeout(t);
  }, [queryPhase, typedQuery]);

  useEffect(() => {
    if (queryPhase !== "flying") return;
    const t = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 450);
    }, 350);
    return () => clearTimeout(t);
  }, [queryPhase, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] bg-bg flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col w-[480px] max-w-[90vw]">
            {/* Header + lines — fade out once query is fully typed */}
            <motion.div
              animate={{ opacity: queryTyped ? 0 : 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="font-mono text-[11px] text-text-ghost border-b border-border pb-4 mb-6">
                [SYS] · Cold Start Protocol v1.0
              </div>
              <div className="flex flex-col gap-5">
                {lines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.28, duration: 0.3 }}
                    className="flex items-center justify-between gap-6"
                  >
                    <span className={`font-mono text-[13px] shrink-0 ${
                      i === lines.length - 1 ? "text-accent" : i >= 3 ? "text-text-muted" : "text-text-primary"
                    }`}>
                      {line.text}
                    </span>
                    {line.bar && (
                      <span className="flex items-center gap-2 shrink-0">
                        <span className="inline-block w-[120px] h-[5px] bg-border rounded-full overflow-hidden">
                          <motion.span
                            className="block h-full bg-accent rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: line.bar.active ? "100%" : "0%" }}
                            transition={{ duration: line.bar.duration / 1000, ease: "easeOut" }}
                          />
                        </span>
                        <span className="font-mono text-[11px] text-text-muted w-[36px] text-right">
                          <AnimatedPct active={line.bar.active} duration={line.bar.duration} />
                        </span>
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Query bar — types in, then flies slowly up to navbar */}
            <AnimatePresence>
              {queryPhase !== "idle" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={
                    queryPhase === "flying"
                      ? { opacity: 0, y: -380, scale: 0.9 }
                      : { opacity: 1, y: 0, scale: 1 }
                  }
                  transition={
                    queryPhase === "flying"
                      ? { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                      : { duration: 0.2 }
                  }
                  className="mt-6"
                >
                  <div className="rounded border border-border px-[14px] py-[6px] font-mono text-[12px] text-text-muted flex items-center gap-[6px]">
                    <span className="shrink-0 text-text-ghost">&gt;</span>
                    <span>{typedQuery}</span>
                    {queryPhase === "typing" && (
                      <span className="animate-blink text-accent shrink-0">&#9612;</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GhostedDocuments() {
  return (
    <div className="relative w-full h-full min-h-[400px]">
      {/* Resume document — clickable to open PDF */}
      <a
        href="/docs/Resume_2026.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-[10%] right-[15%] block hover:opacity-70 transition-opacity duration-300"
        title="View resume.pdf"
      >
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="w-[180px] h-[240px] cursor-pointer"
        viewBox="0 0 180 240"
        fill="none"
      >
        <rect
          x="1"
          y="1"
          width="178"
          height="238"
          rx="4"
          stroke="var(--text-ghost)"
          strokeWidth="1"
        />
        {/* Text lines */}
        <line x1="20" y1="30" x2="120" y2="30" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.5" />
        <line x1="20" y1="45" x2="160" y2="45" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.3" />
        <line x1="20" y1="55" x2="140" y2="55" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.3" />
        <line x1="20" y1="65" x2="155" y2="65" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.3" />
        <line x1="20" y1="85" x2="100" y2="85" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.5" />
        <line x1="20" y1="100" x2="160" y2="100" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.3" />
        <line x1="20" y1="110" x2="145" y2="110" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.3" />
        {/* Retrieved chunk highlight */}
        <rect
          x="15"
          y="40"
          width="150"
          height="35"
          rx="4"
          fill="var(--chunk-bg)"
          stroke="var(--accent)"
          strokeWidth="1"
          opacity="0.4"
        />
      </motion.svg>
      </a>

      {/* LinkedIn card */}
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="absolute top-[25%] right-[5%] w-[160px] h-[200px]"
        viewBox="0 0 160 200"
        fill="none"
      >
        <rect
          x="1"
          y="1"
          width="158"
          height="198"
          rx="4"
          stroke="var(--text-ghost)"
          strokeWidth="1"
        />
        {/* Profile area */}
        <circle cx="40" cy="40" r="15" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.4" />
        <line x1="65" y1="32" x2="130" y2="32" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.4" />
        <line x1="65" y1="44" x2="110" y2="44" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.3" />
        <line x1="20" y1="75" x2="140" y2="75" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.3" />
        <line x1="20" y1="85" x2="130" y2="85" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.3" />
        <line x1="20" y1="95" x2="135" y2="95" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.3" />
        {/* Retrieved chunk highlight */}
        <rect
          x="15"
          y="70"
          width="130"
          height="32"
          rx="4"
          fill="var(--chunk-bg)"
          stroke="var(--accent)"
          strokeWidth="1"
          opacity="0.4"
        />
      </motion.svg>

      {/* Email signature */}
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute top-[55%] right-[10%] w-[150px] h-[100px]"
        viewBox="0 0 150 100"
        fill="none"
      >
        <rect
          x="1"
          y="1"
          width="148"
          height="98"
          rx="4"
          stroke="var(--text-ghost)"
          strokeWidth="1"
        />
        <line x1="15" y1="25" x2="100" y2="25" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.4" />
        <line x1="15" y1="40" x2="135" y2="40" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.3" />
        <line x1="15" y1="50" x2="120" y2="50" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.3" />
        <line x1="15" y1="65" x2="80" y2="65" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.3" />
      </motion.svg>
    </div>
  );
}

function SourceChunkModal({
  chunk,
  onClose,
}: {
  chunk: { title: string; source: string; text: string; highlight: string };
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Highlight the matching text
  const parts = chunk.text.split(new RegExp(`(${chunk.highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-[520px] border border-border bg-bg shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <span className="font-mono text-[11px] text-text-muted">
              retrieved_chunk · relevance: 0.94
            </span>
            <button
              onClick={onClose}
              className="font-mono text-[11px] text-text-ghost hover:text-text-primary transition-colors"
            >
              [ESC]
            </button>
          </div>

          {/* Source label */}
          <div className="px-5 pt-4 pb-2">
            <span className="font-mono text-[10px] text-accent">
              {chunk.source}
            </span>
          </div>

          {/* Section title */}
          <div className="px-5 pb-3">
            <span className="font-mono text-[13px] text-text-primary font-medium">
              {chunk.title}
            </span>
          </div>

          {/* Chunk text with highlight */}
          <div className="px-5 pb-4 border-l-2 border-accent/40 ml-5">
            <p className="font-mono text-[12px] text-text-muted leading-[1.7]">
              {parts.map((part, i) =>
                part.toLowerCase() === chunk.highlight.toLowerCase() ? (
                  <mark
                    key={i}
                    className="bg-accent/20 text-accent px-[3px] py-[1px] rounded-sm font-medium"
                  >
                    {part}
                  </mark>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <span className="font-mono text-[10px] text-text-ghost">
              page 1 · {chunk.source.split(" · ").slice(1).join(" · ")}
            </span>
            <a
              href="/docs/Resume_2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-text-ghost hover:text-accent transition-colors flex items-center gap-1"
            >
              View full document <span>↗</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Hero() {
  const [coldStartDone, setColdStartDone] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [taglineWords, setTaglineWords] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(false);
  const [activeChunk, setActiveChunk] = useState<{
    title: string;
    source: string;
    text: string;
    highlight: string;
  } | null>(null);

  const handleColdStartComplete = () => {
    setColdStartDone(true);
    setTimeout(() => {
      setShowContent(true);
      // Start tagline streaming after rule draws
      const tagline = "I build AI systems that go to production.";
      const words = tagline.split(" ");
      setTimeout(() => {
        setShowCursor(true);
        words.forEach((_, i) => {
          setTimeout(() => {
            setTaglineWords((prev) => [...prev, words[i]]);
            if (i === words.length - 1) {
              setTimeout(() => setShowCursor(false), 2000);
            }
          }, i * 40);
        });
      }, 800); // After rule animation
    }, 100);
  };

  const stats = [
    {
      source: "[source: resume.pdf · experience/strique]",
      number: 87,
      suffix: "%",
      label: "Faster Processing",
      detail: "GenAI analytics pipeline — 90s to 12s",
      chunk: {
        title: "ML Engineer, AV DEVS Solutions Pvt Ltd (Strique)",
        source: "resume.pdf · experience/strique · Jan 2024 – Mar 2025",
        text: "As sole contributor, engineered a production GenAI analytics pipeline (schema design → EDA → feature engineering → prompt design → microservice deployment); reduced summary generation time 87% – from 90s to under 12s.",
        highlight: "87%",
      },
    },
    {
      source: "[source: resume.pdf · experience/espl]",
      number: 7,
      suffix: "+",
      label: "Projects Shipped",
      detail: "Across UK, France, Australia & India",
      chunk: {
        title: "AI Solutions Architect, ESPL",
        source: "resume.pdf · experience/espl · Apr 2025 – Present",
        text: "Owned end-to-end delivery of 7 international AI projects across UK, France, Australia, and India as sole architect, covering requirements, solution design, development, and production deployment.",
        highlight: "7 international AI projects",
      },
    },
    {
      source: "[source: resume.pdf · experience/icigo]",
      number: 30,
      suffix: "%",
      label: "Peak Conversions",
      detail: "Agentic RAG tourism chatbot — ICIGO",
      chunk: {
        title: "AI Solutions Architect, ESPL",
        source: "resume.pdf · experience/espl · Apr 2025 – Present",
        text: "Engineered an agentic RAG tourism chatbot (ICIGO) using LangGraph, FastAPI, and React/Node.js, capturing 30% of peak-season conversions and driving 17% YoY revenue growth for the client.",
        highlight: "30% of peak-season conversions",
      },
    },
    {
      source: "[source: resume.pdf · experience/bulletlock]",
      number: 97,
      suffix: "%",
      label: "Error Reduced",
      detail: "Surgical robotics — ±10cm to <0.3cm",
      chunk: {
        title: "ML Consultant, Bullet Lock Co.",
        source: "resume.pdf · experience/bulletlock · May 2022 – Dec 2023",
        text: "Rebuilt a failing stereo camera depth-tracking pipeline for surgical robotics; reduced positional error 97% – from ±10cm to under 0.3cm – directly enabling accurate robotic instrument movement during live surgical procedures.",
        highlight: "97%",
      },
    },
  ];

  return (
    <section id="hero" className="relative min-h-screen bg-bg">
      {!coldStartDone && <ColdStartOverlay onComplete={handleColdStartComplete} />}

      <div className="max-w-content mx-auto px-6 pt-[52px] min-h-screen flex items-center">
        <div className="w-full flex flex-col lg:flex-row items-start gap-12 lg:gap-0">
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-[55%]">
            {showContent && (
              <motion.div
                initial={!coldStartDone ? { opacity: 0 } : {}}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Label */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="font-mono text-[11px] text-text-muted mb-6"
                >
                  [SYS] · AI Solutions Architect
                </motion.p>

                {/* Name */}
                <div className="mb-6">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="font-display text-[56px] sm:text-[72px] lg:text-[88px] text-text-primary leading-[0.95]"
                  >
                    Saurabh
                  </motion.h1>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="font-display text-[56px] sm:text-[72px] lg:text-[88px] text-text-primary leading-[0.95]"
                  >
                    Sachdev
                  </motion.h1>
                </div>

                {/* Rule */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 280 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                  className="h-[1px] bg-accent mb-6"
                />

                {/* Tagline */}
                <p className="font-body text-[18px] sm:text-[20px] text-text-primary font-normal mb-8 h-[30px]">
                  {taglineWords.join(" ")}
                  {showCursor && (
                    <span className="animate-blink text-accent ml-[2px]">
                      &#9612;
                    </span>
                  )}
                </p>

                {/* Resume retrieve button */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.4 }}
                  className="mb-8"
                >
                  <a
                    href="/docs/Resume_2026.pdf"
                    download="Saurabh_Sachdev_Resume.pdf"
                    className="group relative inline-flex items-center gap-3 border border-accent/40 bg-accent/[0.06] hover:bg-accent/[0.12] hover:border-accent px-5 py-3 transition-all duration-300"
                  >
                    {/* Pulsing left edge */}
                    <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent animate-pulse" />

                    <span className="font-mono text-[12px] text-accent">
                      &gt;
                    </span>
                    <span className="font-mono text-[13px] text-text-primary group-hover:text-accent transition-colors duration-200 font-medium">
                      retrieve
                    </span>
                    <span className="font-mono text-[13px] text-accent font-medium">
                      resume.pdf
                    </span>
                    <svg
                      className="w-4 h-4 text-accent transition-transform duration-300 group-hover:translate-y-[2px]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
                    </svg>
                    <span className="font-mono text-[10px] text-accent/60 ml-1">
                      [PDF · 1 doc]
                    </span>
                  </a>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + i * 0.12, duration: 0.5 }}
                      className="relative border border-border p-5 sm:p-6 flex flex-col overflow-hidden group hover:border-accent/30 transition-colors duration-300"
                    >
                      <button
                        onClick={() => setActiveChunk(stat.chunk)}
                        className="font-mono text-[9px] text-text-ghost mb-4 flex items-center gap-1 hover:text-accent transition-colors duration-150 cursor-pointer text-left"
                        title="View retrieved chunk"
                      >
                        <span className="truncate">{stat.source}</span>
                        <span className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">↗</span>
                      </button>
                      <span className="font-display text-[36px] sm:text-[44px] text-text-primary leading-none">
                        <CountUp target={stat.number} suffix={stat.suffix} />
                      </span>
                      <span className="font-body text-[13px] sm:text-[14px] text-text-primary mt-2 font-medium">
                        {stat.label}
                      </span>
                      <span className="font-mono text-[10px] sm:text-[11px] text-text-muted mt-1 leading-relaxed">
                        {stat.detail}
                      </span>
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-border" />
                      <div
                        className="absolute bottom-0 left-0 h-[2px] bg-accent animate-fill-bar"
                        style={{ width: `${stat.number}%` }}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="hidden lg:block w-[45%] relative">
            {showContent && <GhostedDocuments />}
          </div>
        </div>
      </div>

      {/* Source chunk modal */}
      {activeChunk && (
        <SourceChunkModal
          chunk={activeChunk}
          onClose={() => setActiveChunk(null)}
        />
      )}
    </section>
  );
}
