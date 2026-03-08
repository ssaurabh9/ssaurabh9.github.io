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

function ColdStartOverlay({ onComplete }: { onComplete: () => void }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500);
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const lines = [
    "Initializing knowledge base...",
    "Indexing 4 document collections...",
    "Vector store ready.",
    "Awaiting query.",
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] bg-bg flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-2 font-mono text-[13px] text-text-muted">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.2, duration: 0.3 }}
                className="flex items-center gap-4"
              >
                <span>{line}</span>
                {i === 1 && (
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-[100px] h-[8px] bg-border rounded-sm overflow-hidden">
                      <span className="block h-full bg-accent cold-start-bar-80 rounded-sm" />
                    </span>
                    <span className="text-[10px]">80%</span>
                  </span>
                )}
                {i === 2 && (
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-[100px] h-[8px] bg-border rounded-sm overflow-hidden">
                      <span className="block h-full bg-accent cold-start-bar-100 rounded-sm" />
                    </span>
                    <span className="text-[10px]">100%</span>
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GhostedDocuments() {
  return (
    <div className="relative w-full h-full min-h-[400px]">
      {/* Resume document */}
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute top-[10%] right-[15%] w-[180px] h-[240px]"
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

export default function Hero() {
  const [coldStartDone, setColdStartDone] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [taglineWords, setTaglineWords] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    // Check sessionStorage for cold start
    if (typeof window !== "undefined") {
      const hasPlayed = sessionStorage.getItem("coldStartPlayed");
      if (hasPlayed) {
        setColdStartDone(true);
        setShowContent(true);
        setTaglineWords(
          "I build AI systems that go to production.".split(" ")
        );
        return;
      }
    }
  }, []);

  const handleColdStartComplete = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("coldStartPlayed", "true");
    }
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
      source: "[source: resume.pdf · chunk_03]",
      number: 7,
      suffix: "+",
      label: "Projects Delivered",
    },
    {
      source: "[source: resume.pdf · chunk_03]",
      number: 4,
      suffix: "",
      label: "Markets Served",
    },
    {
      source: "[source: resume.pdf · chunk_03]",
      number: 5,
      suffix: "",
      displayValue: "5→Prod",
      label: "Team Scaled",
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
                <p className="font-body text-[18px] sm:text-[20px] text-text-primary font-normal mb-10 h-[30px]">
                  {taglineWords.join(" ")}
                  {showCursor && (
                    <span className="animate-blink text-accent ml-[2px]">
                      &#9612;
                    </span>
                  )}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 sm:gap-12 mb-10">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
                      className="flex flex-col"
                    >
                      <span className="font-mono text-[10px] text-text-ghost mb-1">
                        {stat.source}
                      </span>
                      <span className="font-display text-[36px] text-text-primary leading-tight">
                        {stat.displayValue ? (
                          stat.displayValue
                        ) : (
                          <CountUp
                            target={stat.number}
                            suffix={stat.suffix}
                          />
                        )}
                      </span>
                      <span className="font-body text-[13px] text-text-muted">
                        {stat.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* View Work */}
                <motion.a
                  href="#experience"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                  className="inline-block font-mono text-[13px] text-accent group cursor-pointer"
                >
                  View Work{" "}
                  <span className="inline-block transition-transform duration-200 group-hover:translate-y-[3px]">
                    ↓
                  </span>
                </motion.a>
              </motion.div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="hidden lg:block w-[45%] relative">
            {showContent && <GhostedDocuments />}
          </div>
        </div>
      </div>
    </section>
  );
}
