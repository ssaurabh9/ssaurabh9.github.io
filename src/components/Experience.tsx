"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

const jobs = [
  {
    version: "v4.0",
    role: "AI Solutions Architect",
    company: "ESPL",
    location: "Pune, IN",
    dates: "Apr 2025–Present",
    relevance: "0.97",
    bullets: [
      {
        text: "Owned end-to-end delivery of 7 international AI projects across UK, France, Australia, India",
        cited: "ESPL_offer_letter.pdf",
        metrics: [] as string[],
      },
      {
        text: "Engineered agentic RAG tourism chatbot (ICIGO) with LangGraph, FastAPI, React/Node.js — captured 30% peak-season conversions, drove 17% YoY revenue growth",
        cited: "ICIGO_delivery_report.pdf",
        metrics: ["30%", "17%"],
      },
      {
        text: "Architected air-gapped on-prem document intelligence system for Bank of Maharashtra — iterated to v5 in production",
        cited: "BankOfMaharashtra_brief.pdf",
        metrics: [] as string[],
      },
      {
        text: "Built LLM-powered proposal automation pipeline — reduced turnaround from 7+ days to under 2 days (70% reduction)",
        cited: "Strique_pipeline_doc.pdf",
        metrics: ["70%"],
      },
      {
        text: "Leveled up 5-person AI team from zero to production-ready in 8 months",
        cited: "ESPL_offer_letter.pdf",
        metrics: [] as string[],
      },
    ],
  },
  {
    version: "v3.0",
    role: "ML Engineer",
    company: "AV DEVS Solutions",
    location: "Vadodara, IN",
    dates: "Jan 2024–Mar 2025",
    relevance: "0.93",
    bullets: [
      {
        text: "Strique: sole contributor, engineered production GenAI analytics pipeline — reduced summary generation time 87% (90s → under 12s)",
        cited: "Strique_pipeline_doc.pdf",
        metrics: ["87%"],
      },
      {
        text: "Fine-tuned LLMs on custom data — hallucination rate below 5%, 60%+ ROI growth for clients",
        cited: "Strique_pipeline_doc.pdf",
        metrics: ["5%", "60%"],
      },
    ],
  },
  {
    version: "v2.0",
    role: "ML Consultant",
    company: "Bullet Lock Co.",
    location: "Kanpur, IN",
    dates: "May 2022–Dec 2023",
    relevance: "0.88",
    bullets: [
      {
        text: "Rebuilt stereo camera depth-tracking pipeline for surgical robotics — reduced positional error 97% (±10cm → under 0.3cm)",
        cited: "BulletLock_project_brief.pdf",
        metrics: ["97%"],
      },
    ],
  },
  {
    version: "v1.0",
    role: "Business Analyst",
    company: "EGverse",
    location: "Gandhinagar, IN",
    dates: "Mar 2021–Feb 2022",
    relevance: "0.82",
    bullets: [
      {
        text: "Managed Walmart Sam's Club rollout across US — survey systems processing 1M+ inputs/day",
        cited: "EGverse_delivery_report.pdf",
        metrics: ["1M+"],
      },
    ],
  },
];

const documents = [
  "ESPL_offer_letter.pdf",
  "BankOfMaharashtra_brief.pdf",
  "ICIGO_delivery_report.pdf",
  "Strique_pipeline_doc.pdf",
];

function HighlightMetrics({
  text,
  metrics,
}: {
  text: string;
  metrics: string[];
}) {
  if (metrics.length === 0) return <>{text}</>;

  let result: (string | React.ReactElement)[] = [text];

  metrics.forEach((metric) => {
    const newResult: (string | React.ReactElement)[] = [];
    result.forEach((part, partIdx) => {
      if (typeof part === "string") {
        const idx = part.indexOf(metric);
        if (idx !== -1) {
          if (idx > 0) newResult.push(part.slice(0, idx));
          newResult.push(
            <span
              key={`${metric}-${partIdx}-${idx}`}
              className="bg-chunk-bg px-1 rounded-sm inline-block"
            >
              {metric}
            </span>
          );
          if (idx + metric.length < part.length)
            newResult.push(part.slice(idx + metric.length));
        } else {
          newResult.push(part);
        }
      } else {
        newResult.push(part);
      }
    });
    result = newResult;
  });

  return <>{result}</>;
}

function DocumentShelf({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="flex flex-col gap-1">
      {documents.map((doc, i) => (
        <div
          key={doc}
          className="relative w-[160px] h-[28px] border border-border rounded-sm bg-bg px-2 flex items-center overflow-hidden"
          style={{ marginLeft: i * 4 }}
        >
          <span className="font-mono text-[10px] text-text-muted truncate">
            {doc}
          </span>
          {i === activeIndex && (
            <div className="absolute left-0 w-full h-[1px] bg-accent opacity-60 animate-scanline" />
          )}
        </div>
      ))}
    </div>
  );
}

function JobCard({
  job,
  index,
}: {
  job: (typeof jobs)[number];
  index: number;
}) {
  const { ref, isInView } = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: "easeOut",
      }}
      className="relative"
    >
      {/* Timeline dot */}
      <div className="absolute -left-[calc(2rem+5px)] sm:-left-[calc(3rem+5px)] top-1 w-[8px] h-[8px] rounded-full bg-border" />

      <div className="relative">
        {/* Version badge */}
        <span className="inline-block font-mono text-[11px] text-text-muted border border-border rounded px-2 py-[2px] mb-3">
          {job.version}
        </span>

        {/* Relevance score */}
        <span className="absolute top-0 right-0 font-mono text-[10px] text-text-ghost">
          relevance: {job.relevance}
        </span>

        {/* Role */}
        <h3 className="font-body text-[18px] font-semibold text-text-primary mb-1">
          {job.role}
        </h3>

        {/* Company details */}
        <p className="font-mono text-[12px] text-text-muted mb-4">
          {job.company} – {job.location} | {job.dates}
        </p>

        {/* Bullets */}
        <ul className="space-y-3">
          {job.bullets.map((bullet, bIdx) => (
            <li key={bIdx}>
              <p className="font-body text-[15px] text-text-primary leading-[1.7]">
                <HighlightMetrics text={bullet.text} metrics={bullet.metrics} />
              </p>
              <p className="font-mono text-[10px] text-text-ghost mt-1">
                [cited from: {bullet.cited}]
              </p>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const { ref: headerRef, isInView: headerInView } = useInView();

  return (
    <section id="experience" className="section-padding bg-bg">
      <div className="max-w-content mx-auto">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col sm:flex-row justify-between items-start mb-16"
        >
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={headerInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="font-mono text-[11px] text-text-muted mb-3"
            >
              [02 · EXPERIENCE]
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-display text-[36px] sm:text-[48px] text-text-primary"
            >
              Where the work lives.
            </motion.h2>
          </div>
          {/* Document shelf */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 sm:mt-0 hidden md:block"
          >
            <DocumentShelf activeIndex={0} />
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-border pl-8 sm:pl-12 space-y-12">
          {jobs.map((job, jobIndex) => (
            <JobCard key={jobIndex} job={job} index={jobIndex} />
          ))}
        </div>
      </div>
    </section>
  );
}
