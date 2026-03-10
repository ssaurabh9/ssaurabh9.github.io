"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── types ──────────────────────────────────────────────────── */

interface CardData {
  id: number;
  platform: "gmail" | "linkedin" | "github";
  address: string;
  latency: string;
  signalBars: number;
  expandedHeight: number;
  expandedContent: React.ReactNode;
}

/* ── SVG icons ──────────────────────────────────────────────── */

function GmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="22,4 12,13 2,4" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  gmail: <GmailIcon />,
  linkedin: <LinkedInIcon />,
  github: <GitHubIcon />,
};

/* ── signal bars ────────────────────────────────────────────── */

function SignalBars({ filled }: { filled: number }) {
  const heights = [12, 9, 7, 5];
  return (
    <div className="flex items-end" style={{ gap: 2 }}>
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: h,
            borderRadius: 1,
            backgroundColor: i < filled ? "var(--accent)" : "var(--border)",
          }}
        />
      ))}
    </div>
  );
}

/* ── sparkline ──────────────────────────────────────────────── */

const SPARKLINE_DATA = [2, 3, 4, 3, 5, 6, 4, 7, 8, 6, 9, 10, 8, 11, 10, 9, 12, 10, 11, 8, 10, 9, 11, 10];
const SPARKLINE_MAX = Math.max(...SPARKLINE_DATA);
const SPARKLINE_MIN_H = 2;
const SPARKLINE_MAX_H = 20;

function Sparkline({ animate }: { animate: boolean }) {
  return (
    <div className="flex items-end" style={{ gap: 2, height: SPARKLINE_MAX_H }}>
      {SPARKLINE_DATA.map((v, i) => {
        const h = SPARKLINE_MIN_H + ((v - Math.min(...SPARKLINE_DATA)) / (SPARKLINE_MAX - Math.min(...SPARKLINE_DATA))) * (SPARKLINE_MAX_H - SPARKLINE_MIN_H);
        return (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={animate ? { height: h } : { height: 0 }}
            transition={{ delay: i * 0.02, duration: 0.3, ease: "easeOut" }}
            style={{
              width: 3,
              borderRadius: 2,
              backgroundColor: "rgba(44, 95, 74, 0.7)",
            }}
          />
        );
      })}
    </div>
  );
}

/* ── expanded content blocks ────────────────────────────────── */

function GmailExpanded() {
  return (
    <>
      <div className="flex gap-8">
        <StatCol label="RESPONSE SLA" value="< 24 hours" />
        <StatCol label="TIMEZONE" value="IST · UTC+5:30" />
        <StatCol label="LANGUAGES" value="EN · HI" />
      </div>
      <p className="font-mono text-[11px] text-text-muted mt-[14px]">
        Best for: Project briefs · Consulting inquiries · Collaborations
      </p>
      <div className="flex justify-between items-center mt-4">
        <span className="font-mono text-[11px] text-text-ghost">
          {"> Ready to receive query."}
        </span>
        <a
          href="https://mail.google.com/mail/?view=cm&to=s.sachdev151@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[12px] text-accent hover:underline hover:opacity-80 transition-opacity"
        >
          Open composer ↗
        </a>
      </div>
    </>
  );
}

function LinkedInExpanded() {
  return (
    <>
      <div className="flex gap-8">
        <StatCol label="CONNECTIONS" value="500+" />
        <StatCol label="ACTIVITY" value="Active" />
        <StatCol label="DOMAIN" value="AI/ML" />
      </div>
      <p className="font-mono text-[11px] text-text-muted mt-[14px]">
        Open to: Senior roles · AI consulting · Research collaborations
      </p>
      <div className="flex justify-between items-center mt-4">
        <span className="font-mono text-[11px] text-text-ghost">
          [profile · public]
        </span>
        <a
          href="https://linkedin.com/in/im-saurabh-sachdev"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[12px] text-accent hover:underline hover:opacity-80 transition-opacity"
        >
          View profile ↗
        </a>
      </div>
    </>
  );
}

function GitHubExpanded({ animate }: { animate: boolean }) {
  return (
    <>
      <div className="flex gap-8">
        <StatCol label="PUBLIC REPOS" value="12" />
        <StatCol label="PINNED" value="Taiga MCP" />
        <StatCol label="LANGUAGE" value="Python" />
      </div>
      <div className="mt-[14px]">
        <p className="font-mono text-[10px] text-text-ghost uppercase tracking-wide mb-1">
          CONTRIBUTION ACTIVITY
        </p>
        <Sparkline animate={animate} />
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="font-mono text-[11px] text-text-ghost">
          [source: github.com/ssaurabh9]
        </span>
        <a
          href="https://github.com/ssaurabh9"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[12px] text-accent hover:underline hover:opacity-80 transition-opacity"
        >
          View repositories ↗
        </a>
      </div>
    </>
  );
}

function StatCol({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] text-text-ghost uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="font-mono text-[13px] text-text-primary font-medium">
        {value}
      </p>
    </div>
  );
}

/* ── chevron ────────────────────────────────────────────────── */

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <motion.svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="var(--text-ghost)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: expanded ? 180 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <polyline points="3,5 7,9 11,5" />
    </motion.svg>
  );
}

/* ── card data ──────────────────────────────────────────────── */

const CARDS: Omit<CardData, "expandedContent">[] = [
  {
    id: 0,
    platform: "gmail",
    address: "s.sachdev151@gmail.com",
    latency: "< 24h",
    signalBars: 4,
    expandedHeight: 210,
  },
  {
    id: 1,
    platform: "linkedin",
    address: "/in/im-saurabh-sachdev",
    latency: "< 48h",
    signalBars: 3,
    expandedHeight: 200,
  },
  {
    id: 2,
    platform: "github",
    address: "/ssaurabh9",
    latency: "async",
    signalBars: 2,
    expandedHeight: 220,
  },
];

/* ── main component ─────────────────────────────────────────── */

export default function ContactCards() {
  const [activeCard, setActiveCard] = useState<number | null>(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(hover: none)").matches);
  }, []);

  const clearCollapseTimer = useCallback(() => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
  }, []);

  const handleHoverStart = useCallback(
    (id: number) => {
      if (isTouchDevice) return;
      clearCollapseTimer();
      setActiveCard(id);
    },
    [isTouchDevice, clearCollapseTimer]
  );

  const handleHoverEnd = useCallback(() => {
    if (isTouchDevice) return;
    clearCollapseTimer();
    collapseTimerRef.current = setTimeout(() => {
      setActiveCard(null);
    }, 100);
  }, [isTouchDevice, clearCollapseTimer]);

  const handleClick = useCallback(
    (id: number) => {
      if (!isTouchDevice) return;
      setActiveCard((prev) => (prev === id ? null : id));
    },
    [isTouchDevice]
  );

  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {CARDS.map((card) => {
        const isExpanded = activeCard === card.id;

        return (
          <motion.div
            key={card.id}
            className="relative cursor-pointer overflow-hidden"
            style={{
              borderRadius: 8,
              border: "1px solid",
              borderColor: isExpanded
                ? "rgba(44, 95, 74, 0.4)"
                : "var(--border)",
            }}
            animate={{
              height: isExpanded ? card.expandedHeight : 64,
              borderColor: isExpanded
                ? "rgba(44, 95, 74, 0.4)"
                : "var(--border)",
            }}
            transition={{
              height: {
                duration: isExpanded ? 0.35 : 0.2,
                ease: isExpanded ? [0.32, 0.72, 0, 1] : "easeIn",
              },
              borderColor: { duration: 0.3 },
            }}
            onHoverStart={() => handleHoverStart(card.id)}
            onHoverEnd={handleHoverEnd}
            onClick={() => handleClick(card.id)}
          >
            {/* Background fill */}
            <motion.div
              className="absolute left-0 top-0 bottom-0"
              style={{ backgroundColor: "rgba(44, 95, 74, 0.08)" }}
              initial={false}
              animate={{ width: isExpanded ? "100%" : "0%" }}
              transition={{
                duration: isExpanded ? 0.3 : 0.2,
                ease: "easeOut",
              }}
            />

            {/* Card surface (white at 60% opacity) */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
            />

            {/* Content */}
            <div className="relative z-10">
              {/* Header row — always visible */}
              <div
                className="flex items-center justify-between"
                style={{ height: 64, padding: "0 20px" }}
              >
                {/* Left group */}
                <div className="flex items-center" style={{ gap: 14 }}>
                  <span className="text-text-muted">
                    {PLATFORM_ICONS[card.platform]}
                  </span>
                  <SignalBars filled={card.signalBars} />
                  <span className="font-mono text-[12px] text-text-muted">
                    {card.platform}
                  </span>
                </div>

                {/* Middle */}
                <div className="flex-1 px-6">
                  <span className="font-sans text-[14px] text-text-primary">
                    {card.address}
                  </span>
                </div>

                {/* Right group */}
                <div className="flex items-center" style={{ gap: 16 }}>
                  <span className="font-mono text-[11px] text-text-ghost">
                    {card.latency}
                  </span>
                  <Chevron expanded={isExpanded} />
                </div>
              </div>

              {/* Divider + expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: isExpanded ? 0.28 : 0.15,
                    }}
                  >
                    {/* Divider */}
                    <motion.div
                      style={{
                        height: 1,
                        backgroundColor: "var(--border)",
                        margin: "0 20px",
                      }}
                      initial={{ clipPath: "inset(0 100% 0 0)" }}
                      animate={{ clipPath: "inset(0 0% 0 0)" }}
                      exit={{ clipPath: "inset(0 100% 0 0)" }}
                      transition={{
                        duration: 0.22,
                        ease: "easeOut",
                        delay: isExpanded ? 0.18 : 0,
                      }}
                    />

                    {/* Expanded content with stagger */}
                    <motion.div
                      style={{ padding: "16px 20px 20px 20px" }}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.055,
                            delayChildren: 0.26,
                          },
                        },
                        hidden: {
                          transition: {
                            staggerChildren: 0.03,
                            staggerDirection: -1,
                          },
                        },
                      }}
                    >
                      <ExpandedChildren
                        platform={card.platform}
                        animate={isExpanded}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── expanded children wrapper ──────────────────────────────── */

const childVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28 },
  },
};

function ExpandedChildren({
  platform,
  animate,
}: {
  platform: string;
  animate: boolean;
}) {
  if (platform === "gmail") {
    return (
      <>
        <motion.div variants={childVariants}>
          <div className="flex gap-8">
            <StatCol label="RESPONSE SLA" value="< 24 hours" />
            <StatCol label="TIMEZONE" value="IST · UTC+5:30" />
            <StatCol label="LANGUAGES" value="EN · HI" />
          </div>
        </motion.div>
        <motion.div variants={childVariants}>
          <p className="font-mono text-[11px] text-text-muted mt-[14px]">
            Best for: Project briefs · Consulting inquiries · Collaborations
          </p>
        </motion.div>
        <motion.div variants={childVariants}>
          <div className="flex justify-between items-center mt-4">
            <span className="font-mono text-[11px] text-text-ghost">
              {"> Ready to receive query."}
            </span>
            <a
              href="https://mail.google.com/mail/?view=cm&to=s.sachdev151@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[12px] text-accent hover:underline hover:opacity-80 transition-opacity"
            >
              Open composer ↗
            </a>
          </div>
        </motion.div>
      </>
    );
  }

  if (platform === "linkedin") {
    return (
      <>
        <motion.div variants={childVariants}>
          <div className="flex gap-8">
            <StatCol label="CONNECTIONS" value="500+" />
            <StatCol label="ACTIVITY" value="Active" />
            <StatCol label="DOMAIN" value="AI/ML" />
          </div>
        </motion.div>
        <motion.div variants={childVariants}>
          <p className="font-mono text-[11px] text-text-muted mt-[14px]">
            Open to: Senior roles · AI consulting · Research collaborations
          </p>
        </motion.div>
        <motion.div variants={childVariants}>
          <div className="flex justify-between items-center mt-4">
            <span className="font-mono text-[11px] text-text-ghost">
              [profile · public]
            </span>
            <a
              href="https://linkedin.com/in/im-saurabh-sachdev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[12px] text-accent hover:underline hover:opacity-80 transition-opacity"
            >
              View profile ↗
            </a>
          </div>
        </motion.div>
      </>
    );
  }

  // github
  return (
    <>
      <motion.div variants={childVariants}>
        <div className="flex gap-8">
          <StatCol label="PUBLIC REPOS" value="12" />
          <StatCol label="PINNED" value="Taiga MCP" />
          <StatCol label="LANGUAGE" value="Python" />
        </div>
      </motion.div>
      <motion.div variants={childVariants}>
        <div className="mt-[14px]">
          <p className="font-mono text-[10px] text-text-ghost uppercase tracking-wide mb-1">
            CONTRIBUTION ACTIVITY
          </p>
          <Sparkline animate={animate} />
        </div>
      </motion.div>
      <motion.div variants={childVariants}>
        <div className="flex justify-between items-center mt-4">
          <span className="font-mono text-[11px] text-text-ghost">
            [source: github.com/ssaurabh9]
          </span>
          <a
            href="https://github.com/ssaurabh9"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[12px] text-accent hover:underline hover:opacity-80 transition-opacity"
          >
            View repositories ↗
          </a>
        </div>
      </motion.div>
    </>
  );
}
