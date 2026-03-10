"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import ContactCards from "./ContactCards";

/* ── constants ──────────────────────────────────────────────── */

const PIPELINE_STEPS = [
  { label: "[1/4] Parsing query intent...", duration: 900 },
  { label: "[2/4] Retrieving contact vectors...", duration: 1100 },
  { label: "[3/4] Generating response...", duration: 1000 },
  { label: "[4/4] Query dispatched to knowledge base owner", duration: 600 },
];

const RESPONSE_TEXT =
  "Your query has been indexed and routed to the knowledge base owner. Expected response latency: < 24 hours.";


/* ── types ──────────────────────────────────────────────────── */

type FormStatus =
  | { phase: "idle" }
  | { phase: "submitting" }
  | { phase: "success"; queryId: string }
  | { phase: "clearing" }
  | { phase: "error"; gmailFallback: string };

type SubmitResult =
  | { ok: true; queryId: string }
  | { ok: false; gmailFallback: string };

/* ── sub-components ─────────────────────────────────────────── */

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

function PipelineAnimation({
  onComplete,
  submitResultRef,
  onError,
}: {
  onComplete: () => void;
  submitResultRef: React.RefObject<SubmitResult | null>;
  onError: (gmailFallback: string) => void;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [pipelineError, setPipelineError] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);
  onCompleteRef.current = onComplete;
  onErrorRef.current = onError;

  useEffect(() => {
    if (pipelineError) return;
    if (activeStep >= PIPELINE_STEPS.length) {
      onCompleteRef.current();
      return;
    }

    const duration = PIPELINE_STEPS[activeStep].duration;
    const t = setTimeout(() => {
      // After each step completes, check if fetch returned an error
      // Don't check on step 0 (too early) — check after steps 1, 2, 3
      const result = submitResultRef.current;
      if (result && !result.ok && activeStep >= 1) {
        // Abort pipeline — show error at this step
        setPipelineError(true);
        setTimeout(() => onErrorRef.current(result.gmailFallback), 2000);
        return;
      }
      setActiveStep((s) => s + 1);
    }, duration);
    return () => clearTimeout(t);
  }, [activeStep, pipelineError, submitResultRef]);

  return (
    <motion.div
      key="submitting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 max-w-[600px]"
    >
      <p className={`font-mono text-[10px] tracking-widest mb-4 ${
        pipelineError ? "text-red-400" : "text-text-ghost"
      }`}>
        {pipelineError ? "RETRIEVAL PIPELINE · FAILED" : "RETRIEVAL PIPELINE · ACTIVE"}
      </p>

      {PIPELINE_STEPS.map((step, i) => {
        const state: "done" | "active" | "pending" =
          i < activeStep ? "done" : i === activeStep ? "active" : "pending";
        const isLast = i === PIPELINE_STEPS.length - 1;
        // This step is where the pipeline broke
        const isFailedStep = pipelineError && i === activeStep;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: state === "pending" ? 0.3 : 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6"
          >
            {/* Label */}
            <span
              className={`font-mono text-[12px] sm:text-[13px] shrink-0 ${
                isFailedStep
                  ? "text-red-400"
                  : state === "done"
                  ? "text-text-muted"
                  : state === "active"
                  ? "text-text-primary"
                  : "text-text-ghost"
              }`}
            >
              {step.label}
              {state === "active" && !pipelineError && (
                <span className="animate-blink text-accent ml-[4px]">
                  &#9612;
                </span>
              )}
            </span>

            {/* Progress bar + pct */}
            {state !== "pending" && !isLast && !isFailedStep && (
              <span className="flex items-center gap-2 shrink-0">
                <span className="inline-block w-[120px] h-[5px] bg-border rounded-full overflow-hidden">
                  <motion.span
                    className="block h-full bg-accent rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: step.duration / 1000,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  />
                </span>
                <span className="font-mono text-[11px] text-text-muted w-[36px] text-right">
                  <AnimatedPct
                    active={state !== "pending"}
                    duration={step.duration}
                  />
                </span>
              </span>
            )}

            {/* Failed step: red progress bar frozen partway */}
            {isFailedStep && (
              <span className="flex items-center gap-2 shrink-0">
                <span className="inline-block w-[120px] h-[5px] bg-border rounded-full overflow-hidden">
                  <motion.span
                    className="block h-full bg-red-400 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "38%" }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  />
                </span>
                <span className="font-mono text-[11px] text-red-400 w-[36px] text-right">
                  ERR
                </span>
              </span>
            )}

            {/* Last step: checkmark when done */}
            {isLast && state === "done" && (
              <span className="font-mono text-[11px] text-accent shrink-0">
                done
              </span>
            )}
          </motion.div>
        );
      })}

      {/* Inline error message */}
      {pipelineError && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="mt-8 border-2 border-red-400/50 bg-red-400/10 rounded-lg p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="font-mono text-[11px] text-red-400 tracking-widest font-bold">
              PIPELINE ERROR
            </span>
          </div>
          <p className="font-mono text-[14px] text-red-400 font-medium mb-2">
            [ERR] Pipeline aborted — failed to reach inference endpoint.
          </p>
          <p className="font-mono text-[12px] text-text-muted">
            Redirecting to fallback channel...
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

function ResponseCard({ queryId }: { queryId: string }) {
  const [displayed, setDisplayed] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    if (displayed.length >= RESPONSE_TEXT.length) {
      setTypingDone(true);
      return;
    }
    const t = setTimeout(
      () => setDisplayed(RESPONSE_TEXT.slice(0, displayed.length + 1)),
      30
    );
    return () => clearTimeout(t);
  }, [displayed]);

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="border border-border rounded p-5 max-w-[600px]"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <span className="w-[6px] h-[6px] rounded-full bg-accent inline-block" />
        <span className="font-mono text-[10px] text-accent tracking-widest">
          QUERY RESULT
        </span>
      </div>

      {/* Metadata */}
      <div className="font-mono text-[10px] text-text-ghost mb-4 space-y-[3px]">
        <div>
          similarity_score: <span className="text-text-muted">0.98</span>
        </div>
        <div>
          source: <span className="text-text-muted">contact_pipeline.py</span>
        </div>
        <div>
          query_id: <span className="text-text-muted">#{queryId}</span>
        </div>
      </div>

      {/* Streamed response */}
      <div className="border-l border-accent pl-3">
        <p className="font-mono text-[12px] text-text-muted leading-[1.8]">
          {displayed}
          {!typingDone && (
            <span className="animate-blink text-accent ml-[2px]">
              &#9612;
            </span>
          )}
        </p>
      </div>
    </motion.div>
  );
}

/* ── main component ─────────────────────────────────────────── */

export default function Contact() {
  const { ref: headerRef, isInView: headerInView } = useInView();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>({ phase: "idle" });
  const [emailError, setEmailError] = useState("");
  const submitResultRef = useRef<SubmitResult | null>(null);

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
    return "";
  };

  // Auto-reset: success → clearing → idle
  useEffect(() => {
    if (status.phase === "success") {
      const t = setTimeout(() => {
        setStatus({ phase: "clearing" });
        setFormData({ name: "", email: "", message: "" });
      }, 6000);
      return () => clearTimeout(t);
    }
    if (status.phase === "clearing") {
      const t = setTimeout(() => setStatus({ phase: "idle" }), 1500);
      return () => clearTimeout(t);
    }
  }, [status.phase]);

  const applyResult = useCallback((result: SubmitResult) => {
    if (result.ok) {
      setStatus({ phase: "success", queryId: result.queryId });
    } else {
      setStatus({ phase: "error", gmailFallback: result.gmailFallback });
    }
  }, []);

  const handlePipelineComplete = useCallback(() => {
    // Pipeline finished all 4 steps — fetch succeeded (errors are caught mid-pipeline)
    const result = submitResultRef.current;
    if (result && result.ok) {
      applyResult(result);
      return;
    }
    // Edge case: fetch still pending — poll briefly
    const poll = setInterval(() => {
      const r = submitResultRef.current;
      if (r) {
        clearInterval(poll);
        applyResult(r);
      }
    }, 200);
    setTimeout(() => clearInterval(poll), 10000);
  }, [applyResult]);

  const handlePipelineError = useCallback((gmailFallback: string) => {
    setStatus({ phase: "error", gmailFallback });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const gmailFallback = `https://mail.google.com/mail/?view=cm&to=s.sachdev151@gmail.com&su=${encodeURIComponent(
      `Portfolio Query from ${formData.name}`
    )}&body=${encodeURIComponent(`${formData.message}\n\nFrom: ${formData.email}`)}`;

    const error = validateEmail(formData.email);
    if (error) {
      setEmailError(error);
      return;
    }
    setEmailError("");
    submitResultRef.current = null;
    setStatus({ phase: "submitting" });

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key:
            process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "YOUR_KEY_HERE",
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `Portfolio Query from ${formData.name}`,
          from_name: "ssaurabh9.github.io",
          botcheck: "",
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const queryId = Math.floor(Math.random() * 0xffff)
        .toString(16)
        .padStart(4, "0");
      submitResultRef.current = { ok: true, queryId };
    } catch {
      submitResultRef.current = { ok: false, gmailFallback };
    }
  };

  return (
    <section
      id="contact"
      className="section-padding bg-bg relative overflow-hidden"
    >
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
          preserveAspectRatio="none"
        >
          <rect x="100" y="100" width="200" height="280" rx="4" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.08" />
          <rect x="850" y="150" width="180" height="250" rx="4" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.08" />
          <rect x="500" y="400" width="220" height="300" rx="4" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.08" />
          <line x1="120" y1="140" x2="260" y2="140" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.06" />
          <line x1="120" y1="160" x2="280" y2="160" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.06" />
          <line x1="870" y1="190" x2="1000" y2="190" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.06" />
          <line x1="870" y1="210" x2="990" y2="210" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.06" />
        </svg>
      </div>

      <div className="max-w-content mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="mb-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="font-mono text-[11px] text-text-muted mb-3"
          >
            [06 · CONTACT]
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-display text-[36px] sm:text-[48px] text-text-primary"
          >
            Send a query.
          </motion.h2>
        </div>

        {/* Contact cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-10"
        >
          <ContactCards />
        </motion.div>

        {/* Phase-based content */}
        <AnimatePresence mode="wait">
          {status.phase === "idle" && (
            <motion.form
              key="idle"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="max-w-[600px] space-y-6"
            >
              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <label className="block font-mono text-[11px] text-text-ghost mb-2">
                  {"// describe what you're building"}
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Describe what you're building..."
                  rows={5}
                  required
                  className="w-full bg-transparent border border-border rounded px-4 py-3 font-body text-[15px] text-text-primary placeholder:text-text-ghost resize-none focus:border-accent transition-colors"
                />
              </motion.div>

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={headerInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Name"
                    required
                    className="w-full bg-transparent border border-border rounded px-4 py-3 font-body text-[15px] text-text-primary placeholder:text-text-ghost focus:border-accent transition-colors"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={headerInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.65, duration: 0.5 }}
                >
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (emailError) setEmailError("");
                    }}
                    placeholder="Email"
                    required
                    className={`w-full bg-transparent border rounded px-4 py-3 font-body text-[15px] text-text-primary placeholder:text-text-ghost transition-colors ${
                      emailError ? "border-red-400 focus:border-red-400" : "border-border focus:border-accent"
                    }`}
                  />
                  {emailError && (
                    <p className="font-mono text-[10px] text-red-400 mt-1">
                      [ERR] {emailError}
                    </p>
                  )}
                </motion.div>
              </div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.75, duration: 0.5 }}
              >
                <button
                  type="submit"
                  className="bg-accent text-white font-mono text-[14px] px-6 py-3 rounded hover:scale-[1.02] hover:brightness-90 transition-all duration-200"
                >
                  Execute Query →
                </button>
              </motion.div>
            </motion.form>
          )}

          {status.phase === "submitting" && (
            <PipelineAnimation
              onComplete={handlePipelineComplete}
              submitResultRef={submitResultRef}
              onError={handlePipelineError}
            />
          )}

          {status.phase === "success" && (
            <ResponseCard queryId={status.queryId} />
          )}

          {status.phase === "clearing" && (
            <motion.div
              key="clearing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-[11px] text-text-ghost py-8 max-w-[600px]"
            >
              [CONTEXT CLEARED] · Awaiting next query.
            </motion.div>
          )}

          {status.phase === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="max-w-[600px] border-2 border-red-400/40 bg-red-400/5 rounded-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="font-mono text-[11px] text-red-400 tracking-widest font-bold">
                  FALLBACK MODE
                </span>
              </div>
              <p className="font-mono text-[15px] text-text-primary font-medium mb-2">
                Pipeline failed. Use the direct channel instead.
              </p>
              <p className="font-mono text-[11px] text-text-muted mb-5">
                Your message has been preserved — click below to send via Gmail.
              </p>
              <a
                href={status.gmailFallback}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-400 text-white font-mono text-[13px] px-5 py-3 rounded hover:bg-red-500 transition-colors inline-block"
              >
                Open Gmail →
              </a>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
