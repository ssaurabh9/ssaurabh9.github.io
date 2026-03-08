"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

const clusters = [
  {
    name: "GenAI & Agentic",
    similarity: 0.94,
    barWidth: "94%",
    skills: [
      "LangGraph",
      "LangChain",
      "RAG",
      "Agentic Pipelines",
      "LLM Fine-tuning",
      "Prompt Engineering",
      "MCP (Model Context Protocol)",
    ],
  },
  {
    name: "ML & NLP",
    similarity: 0.89,
    barWidth: "89%",
    skills: [
      "TensorFlow",
      "PyTorch",
      "Scikit-learn",
      "NLP",
      "Computer Vision",
      "Deep Learning",
      "Embeddings (MiniLM, BAAI)",
    ],
  },
  {
    name: "Backend & Infra",
    similarity: 0.81,
    barWidth: "81%",
    skills: [
      "Python",
      "FastAPI",
      "Docker",
      "Linux",
      "MLOps",
      "Microservices",
      "On-Prem LLM Deployment",
      "Git",
    ],
  },
  {
    name: "Data & Vector",
    similarity: 0.76,
    barWidth: "76%",
    skills: ["SQL", "Qdrant", "ChromaDB", "PgVector", "AWS", "Azure", "GCP"],
  },
];

const extractionMap = [
  { source: "ESPL experience", targets: "LangGraph, FastAPI" },
  { source: "BOM project", targets: "On-Prem LLM" },
  { source: "Strique pipeline", targets: "Fine-tuning" },
  { source: "IEEE publications", targets: "NLP, CV" },
];

function SkillCluster({
  cluster,
  index,
}: {
  cluster: (typeof clusters)[number];
  index: number;
}) {
  const { ref, isInView } = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      {/* Cluster name */}
      <p className="font-mono text-[13px] text-text-muted uppercase mb-3">
        {cluster.name}
      </p>

      {/* Similarity bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-[160px] h-[4px] bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={isInView ? { width: cluster.barWidth } : {}}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <span className="font-mono text-[10px] text-text-ghost">
          {cluster.similarity.toFixed(2)}
        </span>
      </div>

      {/* Skill tags */}
      <div className="flex flex-wrap gap-2">
        {cluster.skills.map((skill, sIdx) => (
          <motion.span
            key={skill}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              delay: 0.4 + sIdx * 0.03,
              duration: 0.3,
            }}
            className="font-mono text-[11px] text-text-primary border border-border rounded-full px-[10px] py-[3px]"
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const { ref: headerRef, isInView: headerInView } = useInView();

  return (
    <section id="skills" className="section-padding bg-bg">
      <div className="max-w-content mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="font-mono text-[11px] text-text-muted mb-3"
          >
            [04 · CAPABILITIES]
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-display text-[36px] sm:text-[48px] text-text-primary"
          >
            Extracted from the corpus.
          </motion.h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* LEFT — Extraction diagram */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="lg:w-[35%] hidden lg:block"
          >
            <div className="space-y-5">
              {extractionMap.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="font-mono text-[11px] text-text-ghost w-[140px] text-right shrink-0">
                    {item.source}
                  </span>
                  <svg width="60" height="2" className="shrink-0">
                    <motion.line
                      x1="0"
                      y1="1"
                      x2="60"
                      y2="1"
                      stroke="var(--text-ghost)"
                      strokeWidth="1"
                      opacity="0.35"
                      initial={{ pathLength: 0 }}
                      animate={headerInView ? { pathLength: 1 } : {}}
                      transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
                    />
                  </svg>
                  <span className="font-mono text-[11px] text-text-muted">
                    {item.targets}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Skill clusters */}
          <div className="lg:w-[65%] space-y-10">
            {clusters.map((cluster, i) => (
              <SkillCluster key={cluster.name} cluster={cluster} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
