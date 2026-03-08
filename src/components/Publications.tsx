"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

const papers = [
  {
    conference: "IEEE · INCET 2020",
    title:
      "Accuracy-relevance trade-off in transfer learning for object detection",
    similarity: "0.91",
  },
  {
    conference: "IEEE · HYDCON 2020",
    title:
      "Improving the efficiency of spectral feature extraction by structuring audio files",
    similarity: "0.88",
  },
];

const sqlLines = [
  "SELECT * FROM ieee_xplore",
  "WHERE author LIKE '%Sachdev%'",
  "ORDER BY year DESC;",
  "\u2192 2 results found.",
];

function TypedSQL({ isInView }: { isInView: boolean }) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isInView || hasRun.current) return;
    hasRun.current = true;

    sqlLines.forEach((line, i) => {
      setTimeout(() => {
        setDisplayedLines((prev) => [...prev, line]);
      }, i * 300);
    });
  }, [isInView]);

  return (
    <div className="font-mono text-[12px] text-text-muted mb-10 space-y-1">
      {displayedLines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
}

function PaperCard({
  paper,
  index,
}: {
  paper: (typeof papers)[number];
  index: number;
}) {
  const { ref, isInView } = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="border border-border rounded-md p-6 sm:p-8"
    >
      {/* Conference badge */}
      <span className="inline-block font-mono text-[11px] text-accent border border-accent rounded-full px-3 py-[2px] mb-4">
        {paper.conference}
      </span>

      {/* Title */}
      <h3 className="font-body text-[17px] font-medium text-text-primary mb-3">
        &ldquo;{paper.title}&rdquo;
      </h3>

      {/* Metadata */}
      <div className="flex flex-wrap gap-6">
        <span className="font-mono text-[10px] text-text-ghost">
          [chunk_02 · abstract]
        </span>
        <span className="font-mono text-[10px] text-text-ghost">
          Embedding similarity: {paper.similarity}
        </span>
      </div>
    </motion.div>
  );
}

export default function Publications() {
  const { ref: headerRef, isInView: headerInView } = useInView();

  return (
    <section id="publications" className="section-padding bg-bg">
      <div className="max-w-content mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="font-mono text-[11px] text-text-muted mb-3"
          >
            [05 · PUBLICATIONS]
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-display text-[36px] sm:text-[48px] text-text-primary"
          >
            From the archive.
          </motion.h2>
        </div>

        {/* SQL Query */}
        <TypedSQL isInView={headerInView} />

        {/* Paper Cards */}
        <div className="space-y-6">
          {papers.map((paper, i) => (
            <PaperCard key={paper.title} paper={paper} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
