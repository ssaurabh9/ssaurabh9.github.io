"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

const projects = [
  {
    name: "Taiga MCP",
    description:
      "Natural-language project management agent over Taiga REST API",
    stack: ["Python", "MCP", "Claude API", "FastAPI"],
    sources: ["README.md", "pyproject.toml"],
    note: "// retrieved using the same API it's built on",
    noteOnTag: "Claude API",
  },
  {
    name: "Firefly MCP",
    description:
      "Offline LLM meeting intelligence with MoMs, decision tracking, Drive sync",
    stack: ["Python", "MCP", "Claude API", "FastAPI"],
    sources: ["README.md", "schema.json"],
    note: null,
    noteOnTag: null,
  },
];

function FileTree() {
  return (
    <div className="font-mono text-[12px] text-text-muted leading-[1.8] whitespace-nowrap">
      <div>/corpus</div>
      <div>├── taiga-mcp/</div>
      <div>
        │&nbsp;&nbsp; ├── README.md{" "}
        <span className="text-accent animate-pulse">← scanning</span>
      </div>
      <div>│&nbsp;&nbsp; ├── pyproject.toml</div>
      <div>│&nbsp;&nbsp; └── commits.log</div>
      <div>└── firefly-mcp/</div>
      <div>
        &nbsp;&nbsp;&nbsp;&nbsp;├── README.md{" "}
        <span className="text-accent animate-pulse">← scanning</span>
      </div>
      <div>&nbsp;&nbsp;&nbsp;&nbsp;└── schema.json</div>
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const { ref, isInView } = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="border border-border rounded-md p-6 sm:p-8 relative"
    >
      {/* Status */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-[6px] h-[6px] rounded-full bg-accent inline-block" />
        <span className="font-mono text-[11px] text-accent">Production</span>
      </div>

      {/* Name */}
      <h3 className="font-display text-[24px] sm:text-[28px] text-text-primary mb-2">
        {project.name}
      </h3>

      {/* Description */}
      <p className="font-body text-[15px] text-text-muted mb-5">
        {project.description}
      </p>

      {/* Stack tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.stack.map((tech) => (
          <div key={tech} className="relative">
            <span className="font-mono text-[11px] text-text-primary border border-border rounded-full px-[10px] py-[3px] inline-block">
              {tech}
            </span>
            {project.noteOnTag === tech && project.note && (
              <span className="block font-mono text-[10px] text-text-ghost italic mt-1">
                {project.note}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Source attribution */}
      <div className="flex gap-4 mt-4">
        {project.sources.map((src) => (
          <span key={src} className="font-mono text-[10px] text-text-ghost">
            ← {src}
          </span>
        ))}
      </div>

      {/* Connector line SVG (decorative) */}
      <svg
        className="absolute -left-8 top-1/2 w-8 h-[1px] hidden lg:block"
        viewBox="0 0 32 1"
      >
        <line
          x1="0"
          y1="0.5"
          x2="32"
          y2="0.5"
          stroke="var(--text-ghost)"
          strokeWidth="1"
          opacity="0.4"
        />
      </svg>
    </motion.div>
  );
}

export default function Projects() {
  const { ref: headerRef, isInView: headerInView } = useInView();

  return (
    <section id="projects" className="section-padding bg-bg">
      <div className="max-w-content mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="font-mono text-[11px] text-text-muted mb-3"
          >
            [03 · OPEN SOURCE]
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-display text-[36px] sm:text-[48px] text-text-primary"
          >
            Shipped to the commons.
          </motion.h2>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* File Tree */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:w-[35%] p-6 border border-border rounded bg-bg overflow-x-auto"
          >
            <FileTree />
          </motion.div>

          {/* Project Cards */}
          <div className="lg:w-[65%] space-y-8">
            {projects.map((project, i) => (
              <ProjectCard key={project.name} project={project} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
