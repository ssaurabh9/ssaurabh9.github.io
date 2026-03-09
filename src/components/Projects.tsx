"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import githubStats from "@/data/github-stats.json";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FileNode {
  name: string;
  type: "file" | "dir";
  url: string | null;
  tokens?: number;
  scanIndex?: number;
  children?: FileNode[];
}

// ─── Corpus tree (real structure from github.com/ssaurabh9/taiga-mcp) ────────
const B = "https://github.com/ssaurabh9/taiga-mcp/blob/main";

const CORPUS: FileNode[] = [
  {
    name: "taiga-mcp",
    type: "dir",
    url: "https://github.com/ssaurabh9/taiga-mcp",
    children: [
      { name: ".env.example",             type: "file", url: `${B}/.env.example`,             tokens: 43,   scanIndex: 0  },
      { name: ".gitignore",               type: "file", url: `${B}/.gitignore`,               tokens: 1194, scanIndex: 1  },
      { name: "LICENSE",                  type: "file", url: `${B}/LICENSE`,                  tokens: 8787, scanIndex: 2  },
      { name: "README.md",                type: "file", url: `${B}/README.md`,                tokens: 3136, scanIndex: 3  },
      { name: "RUN.md",                   type: "file", url: `${B}/RUN.md`,                   tokens: 2939, scanIndex: 4  },
      { name: "claude_desktop_config.json", type: "file", url: `${B}/claude_desktop_config.json`, tokens: 90, scanIndex: 5 },
      { name: "pyproject.toml",           type: "file", url: `${B}/pyproject.toml`,           tokens: 407,  scanIndex: 6  },
      { name: "requirements-dev.txt",     type: "file", url: `${B}/requirements-dev.txt`,     tokens: 41,   scanIndex: 7  },
      { name: "requirements.txt",         type: "file", url: `${B}/requirements.txt`,         tokens: 27,   scanIndex: 8  },
      {
        name: "app", type: "dir", url: null,
        children: [
          { name: "__init__.py", type: "file", url: `${B}/app/__init__.py`, tokens: 27,   scanIndex: 9  },
          { name: "config.py",   type: "file", url: `${B}/app/config.py`,   tokens: 286,  scanIndex: 10 },
          { name: "server.py",   type: "file", url: `${B}/app/server.py`,   tokens: 7716, scanIndex: 11 },
          {
            name: "core", type: "dir", url: null,
            children: [
              { name: "__init__.py",   type: "file", url: `${B}/app/core/__init__.py`,   tokens: 12,   scanIndex: 12 },
              { name: "auth.py",       type: "file", url: `${B}/app/core/auth.py`,       tokens: 876,  scanIndex: 13 },
              { name: "client.py",     type: "file", url: `${B}/app/core/client.py`,     tokens: 1363, scanIndex: 14 },
              { name: "exceptions.py", type: "file", url: `${B}/app/core/exceptions.py`, tokens: 261,  scanIndex: 15 },
            ],
          },
          {
            name: "models", type: "dir", url: null,
            children: [
              { name: "__init__.py",  type: "file", url: `${B}/app/models/__init__.py`,  tokens: 11,  scanIndex: 16 },
              { name: "project.py",   type: "file", url: `${B}/app/models/project.py`,   tokens: 427, scanIndex: 17 },
              { name: "status.py",    type: "file", url: `${B}/app/models/status.py`,    tokens: 145, scanIndex: 18 },
              { name: "task.py",      type: "file", url: `${B}/app/models/task.py`,      tokens: 615, scanIndex: 19 },
              { name: "user.py",      type: "file", url: `${B}/app/models/user.py`,      tokens: 152, scanIndex: 20 },
              { name: "userstory.py", type: "file", url: `${B}/app/models/userstory.py`, tokens: 685, scanIndex: 21 },
            ],
          },
          {
            name: "services", type: "dir", url: null,
            children: [
              { name: "__init__.py",          type: "file", url: `${B}/app/services/__init__.py`,          tokens: 12,   scanIndex: 22 },
              { name: "project_service.py",   type: "file", url: `${B}/app/services/project_service.py`,   tokens: 461,  scanIndex: 23 },
              { name: "task_service.py",      type: "file", url: `${B}/app/services/task_service.py`,      tokens: 548,  scanIndex: 24 },
              { name: "user_service.py",      type: "file", url: `${B}/app/services/user_service.py`,      tokens: 130,  scanIndex: 25 },
              { name: "userstory_service.py", type: "file", url: `${B}/app/services/userstory_service.py`, tokens: 1098, scanIndex: 26 },
            ],
          },
        ],
      },
      {
        name: "tests", type: "dir", url: null,
        children: [
          { name: "__init__.py", type: "file", url: `${B}/tests/__init__.py`, tokens: 9, scanIndex: 27 },
        ],
      },
    ],
  },
  {
    name: "firefly-mcp", type: "dir", url: null,
    children: [
      { name: "README.md",   type: "file", url: null, tokens: 1800, scanIndex: 28 },
      { name: "schema.json", type: "file", url: null, tokens: 800,  scanIndex: 29 },
    ],
  },
];

// ─── Scan config ──────────────────────────────────────────────────────────────
const SCAN_FILES = [
  { scanIndex: 0,  tokens: 43   },  // .env.example
  { scanIndex: 1,  tokens: 1194 },  // .gitignore
  { scanIndex: 2,  tokens: 8787 },  // LICENSE
  { scanIndex: 3,  tokens: 3136 },  // README.md
  { scanIndex: 4,  tokens: 2939 },  // RUN.md
  { scanIndex: 5,  tokens: 90   },  // claude_desktop_config.json
  { scanIndex: 6,  tokens: 407  },  // pyproject.toml
  { scanIndex: 7,  tokens: 41   },  // requirements-dev.txt
  { scanIndex: 8,  tokens: 27   },  // requirements.txt
  { scanIndex: 9,  tokens: 27   },  // app/__init__.py
  { scanIndex: 10, tokens: 286  },  // app/config.py
  { scanIndex: 11, tokens: 7716 },  // app/server.py
  { scanIndex: 12, tokens: 12   },  // app/core/__init__.py
  { scanIndex: 13, tokens: 876  },  // app/core/auth.py
  { scanIndex: 14, tokens: 1363 },  // app/core/client.py
  { scanIndex: 15, tokens: 261  },  // app/core/exceptions.py
  { scanIndex: 16, tokens: 11   },  // app/models/__init__.py
  { scanIndex: 17, tokens: 427  },  // app/models/project.py
  { scanIndex: 18, tokens: 145  },  // app/models/status.py
  { scanIndex: 19, tokens: 615  },  // app/models/task.py
  { scanIndex: 20, tokens: 152  },  // app/models/user.py
  { scanIndex: 21, tokens: 685  },  // app/models/userstory.py
  { scanIndex: 22, tokens: 12   },  // app/services/__init__.py
  { scanIndex: 23, tokens: 461  },  // app/services/project_service.py
  { scanIndex: 24, tokens: 548  },  // app/services/task_service.py
  { scanIndex: 25, tokens: 130  },  // app/services/user_service.py
  { scanIndex: 26, tokens: 1098 },  // app/services/userstory_service.py
  { scanIndex: 27, tokens: 9    },  // tests/__init__.py
  { scanIndex: 28, tokens: 1800 },  // firefly-mcp/README.md
  { scanIndex: 29, tokens: 800  },  // firefly-mcp/schema.json
];

const TOTAL = SCAN_FILES.length; // 30
// Variable delay per file: proportional to tokens, clamped [250, 900] ms
const SCAN_DELAYS = SCAN_FILES.map((f) =>
  Math.max(250, Math.min(Math.floor(f.tokens / 5), 900))
);
const TOTAL_TOKENS = SCAN_FILES.reduce((s, f) => s + f.tokens, 0);

// Flat name lookup: scanIndex → filename
const SCAN_FILE_NAMES: string[] = [];
(function walk(nodes: FileNode[]) {
  for (const n of nodes) {
    if (n.scanIndex !== undefined) SCAN_FILE_NAMES[n.scanIndex] = n.name;
    if (n.children) walk(n.children);
  }
})(CORPUS);

// Folders to auto-open as the scan reaches them
const AUTO_OPENS: [number, string][] = [
  [0,  "taiga-mcp"],
  [9,  "taiga-mcp/app"],
  [12, "taiga-mcp/app/core"],
  [16, "taiga-mcp/app/models"],
  [22, "taiga-mcp/app/services"],
  [27, "taiga-mcp/tests"],
  [28, "firefly-mcp"],
];

// Folders to collapse once all their files are scanned
// key = first scanIndex AFTER the folder's last file
const AUTO_CLOSES: [number, string[]][] = [
  [16, ["taiga-mcp/app/core"]],                      // core/ done after idx 15
  [22, ["taiga-mcp/app/models"]],                    // models/ done after idx 21
  [27, ["taiga-mcp/app/services"]],                  // services/ done after idx 26
  [28, ["taiga-mcp/app", "taiga-mcp/tests"]], // app/ + tests/ done after idx 27
];

// Module-level flag: scan runs once per page load, resets on refresh
let _scanDone = false;

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

// ─── Project data ─────────────────────────────────────────────────────────────
const projects = [
  {
    name: "Taiga MCP",
    description:
      "Natural-language project management agent over Taiga REST API — create sprints, assign tasks, and query project state in plain English.",
    stack: ["Python", "MCP", "Claude API", "FastAPI"],
    query: "gh api repos/ssaurabh9/taiga-mcp",
    repoSlug: "ssaurabh9/taiga-mcp",
    naturalQuery: "get live stars, forks, issues and language for taiga-mcp",
    meta: { chunks: 18, tokens: "3.1k" },
    repoUrl: "https://github.com/ssaurabh9/taiga-mcp",
    docSources: [
      { name: "README.md", url: `${B}/README.md` },
      { name: "RUN.md", url: `${B}/RUN.md` },
    ],
    status: "Production",
  },
  {
    name: "Firefly MCP",
    description:
      "Offline LLM meeting intelligence — captures MoMs, tracks decisions and action items, syncs to Drive without sending audio to the cloud.",
    stack: ["Python", "MCP", "Claude API", "FastAPI"],
    query: "gh api repos/ssaurabh9/firefly-mcp",
    repoSlug: "ssaurabh9/firefly-mcp",
    naturalQuery: "get live stars, forks, issues and language for firefly-mcp",
    meta: { chunks: 14, tokens: "2.8k" },
    repoUrl: "https://github.com/ssaurabh9/firefly-mcp",
    docSources: [{ name: "README.md", url: null }],
    status: "In Progress",
  },
];

// ─── Tree Node ────────────────────────────────────────────────────────────────
interface TreeNodeProps {
  node: FileNode;
  isLast: boolean;
  visualPrefix: string;
  logicalPath: string;
  openPaths: Set<string>;
  onToggle: (path: string) => void;
  scanIdx: number;
}

function TreeNode({ node, isLast, visualPrefix, logicalPath, openPaths, onToggle, scanIdx }: TreeNodeProps) {
  const connector = isLast ? "└── " : "├── ";
  const childIndent = isLast ? "    " : "│   ";
  const isOpen = node.type === "dir" && openPaths.has(logicalPath);

  const scanState =
    node.type === "file" && node.scanIndex !== undefined
      ? scanIdx === node.scanIndex
        ? "scanning"
        : scanIdx > node.scanIndex
        ? "done"
        : "pending"
      : "neutral";

  const textCls =
    scanState === "scanning"
      ? "text-text-primary"
      : scanState === "pending"
      ? "text-text-ghost"
      : "text-text-muted";

  return (
    <>
      <div
        className={`flex items-center rounded-sm transition-colors duration-300 ${
          scanState === "scanning" ? "bg-chunk-bg" : ""
        }`}
      >
        <div className="flex items-center flex-1 min-w-0">
          <span className={`whitespace-pre shrink-0 transition-colors duration-300 ${textCls}`}>
            {visualPrefix}{connector}
          </span>

          {node.type === "dir" ? (
            <span className="flex items-center gap-1.5">
              <button
                onClick={() => onToggle(logicalPath)}
                className={`flex items-center gap-1 hover:text-accent transition-colors cursor-pointer ${textCls}`}
              >
                <span className="text-[9px] opacity-70">{isOpen ? "▼" : "▶"}</span>
                <span>{node.name}/</span>
              </button>
              {node.url && (
                <a
                  href={node.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-ghost hover:text-accent transition-colors text-[10px]"
                >
                  ↗
                </a>
              )}
            </span>
          ) : node.url ? (
            <a
              href={node.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:text-accent transition-colors truncate ${textCls}`}
            >
              {node.name}
            </a>
          ) : (
            <span className={textCls}>{node.name}</span>
          )}
        </div>

        {/* Scan indicator — fixed width so layout never shifts */}
        <span className="w-9 text-right shrink-0 text-[10px] ml-1">
          {scanState === "scanning" && (
            <span className="text-accent animate-blink">▊</span>
          )}
          {scanState === "done" && node.tokens && (
            <span className="text-text-ghost">{fmt(node.tokens)}</span>
          )}
        </span>
      </div>

      {/* Collapsible children */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={logicalPath + "-open"}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            {node.children?.map((child, i) => (
              <TreeNode
                key={child.name}
                node={child}
                isLast={i === (node.children?.length ?? 0) - 1}
                visualPrefix={visualPrefix + childIndent}
                logicalPath={`${logicalPath}/${child.name}`}
                openPaths={openPaths}
                onToggle={onToggle}
                scanIdx={scanIdx}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── File Tree ────────────────────────────────────────────────────────────────
function FileTree({ startScan }: { startScan: boolean }) {
  const [scanIdx, setScanIdx] = useState(_scanDone ? TOTAL : 0);
  const isDone = scanIdx >= TOTAL;
  const [openPaths, setOpenPaths] = useState<Set<string>>(new Set());

  // Variable-delay scan — each file advances after its proportional delay
  useEffect(() => {
    if (isDone || !startScan) return;
    const delay = SCAN_DELAYS[scanIdx] ?? 400;
    const t = setTimeout(() => setScanIdx((i) => i + 1), delay);
    return () => clearTimeout(t);
  }, [scanIdx, isDone, startScan]);

  // Auto-open subdirectory folders as the scan reaches them
  useEffect(() => {
    const found = AUTO_OPENS.find(([idx]) => idx === scanIdx);
    if (found) setOpenPaths((prev) => new Set(Array.from(prev).concat(found[1])));
  }, [scanIdx]);

  // Collapse each folder as soon as all its files are scanned
  useEffect(() => {
    const entry = AUTO_CLOSES.find(([idx]) => idx === scanIdx);
    if (entry) {
      const paths = entry[1];
      setOpenPaths((prev) => {
        const next = new Set(prev);
        for (const p of paths) next.delete(p);
        return next;
      });
    }
  }, [scanIdx]);

  // Persist completion so remounts skip the scan
  useEffect(() => {
    if (isDone) _scanDone = true;
  }, [isDone]);

  const progress = isDone ? 100 : Math.round((scanIdx / TOTAL) * 100);

  function toggle(path: string) {
    setOpenPaths((prev) => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  }

  return (
    <div className="font-mono text-[12px] text-text-muted leading-[1.8] select-none">
      {/* Header + progress % */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-ghost text-[11px]">/corpus</span>
        <span className="text-text-ghost text-[10px] tabular-nums">{progress}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-px bg-border mb-4 overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Tree */}
      <div className="whitespace-nowrap">
        {CORPUS.map((node, i) => (
          <TreeNode
            key={node.name}
            node={node}
            isLast={i === CORPUS.length - 1}
            visualPrefix=""
            logicalPath={node.name}
            openPaths={openPaths}
            onToggle={toggle}
            scanIdx={scanIdx}
          />
        ))}
      </div>

      {/* Live footer */}
      <div className="mt-5 pt-4 border-t border-border text-[10px] text-text-ghost">
        {!isDone ? (
          <div className="flex items-center gap-2">
            <span className="w-[5px] h-[5px] rounded-full bg-accent animate-pulse inline-block shrink-0" />
            <span>
              reading{" "}
              <span className="text-text-muted">{SCAN_FILE_NAMES[scanIdx]}</span>
            </span>
            <span className="ml-auto tabular-nums">[{scanIdx + 1}/{TOTAL}]</span>
          </div>
        ) : (
          <div className="space-y-[3px]">
            <div className="flex items-center gap-2">
              <span className="w-[5px] h-[5px] rounded-full bg-accent inline-block shrink-0" />
              <span className="text-text-muted">corpus ready</span>
            </div>
            <div>{TOTAL} files · {fmt(TOTAL_TOKENS)} tokens</div>
            <div>index: faiss · dim: 1536</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Stats Block (typewriter + toggle) ───────────────────────────────────────
function StatsBlock({
  project,
  isInView,
}: {
  project: (typeof projects)[number];
  isInView: boolean;
}) {
  const [ready, setReady] = useState(false);
  const [showJson, setShowJson] = useState(false);

  // Use stats from codebase JSON — updated via `npm run fetch-stats`
  const storedEntry = (githubStats as unknown as Record<string, { fields: [string, string | number][]; ts: number }>)[project.repoSlug];
  const apiFields: [string, string | number][] = storedEntry?.fields ?? [];

  // Show results when card enters view
  useEffect(() => {
    if (!isInView || ready) return;
    const t = setTimeout(() => setReady(true), 150);
    return () => clearTimeout(t);
  }, [isInView, ready]);

  return (
    <div className="border border-border rounded p-4 mb-5 font-mono text-[11px]">
      {/* Query — prominent, accent-bordered */}
      <div className="border-l-2 border-accent pl-3 mb-4">
        <div className="text-accent text-[10px] mb-1 tracking-widest font-semibold uppercase">QUERY</div>
        <div className="text-text-primary text-[12px] leading-snug">
          &ldquo;{project.naturalQuery}&rdquo;
        </div>
      </div>

      {/* JSON raw view */}
      <AnimatePresence>
        {showJson && (
          <motion.div
            key="raw"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
            className="mb-3 pb-3 border-b border-border"
          >
            <div className="pl-3">
              <div className="text-[10px] text-text-ghost mb-1 flex items-center gap-1.5">
                <span className="text-accent">→</span>
                <span>Response</span>
              </div>
              <span className="text-text-ghost">{"{"}</span>
              {apiFields.map(([key, val], i) => (
                <div key={String(key)} className="pl-4">
                  <span className="text-text-muted">&quot;{key}&quot;:{" "}</span>
                  <span className="text-text-primary">
                    {typeof val === "string" ? `"${val}"` : val}
                  </span>
                  {i < apiFields.length - 1 && (
                    <span className="text-text-ghost">,</span>
                  )}
                </div>
              ))}
              <span className="text-text-ghost">{"}"}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formatted stats — shown when in view */}
      <AnimatePresence>
        {ready && (
          <motion.div
            key="stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-[10px] text-text-ghost">
                <span className="text-accent">→</span>
                <span>Result</span>
              </div>
              <button
                onClick={() => setShowJson((v) => !v)}
                className="text-[10px] text-text-ghost hover:text-accent transition-colors border border-border rounded px-1.5 py-0.5"
              >
                {showJson ? "↑ hide" : "{ } json"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 pl-3">
              {apiFields.length > 0 ? apiFields.map(([key, val]) => (
                <div key={String(key)} className="flex items-baseline gap-1.5">
                  <span className="text-text-ghost text-[10px]">{key}</span>
                  <span className="text-text-primary">
                    {typeof val === "string" ? val : val}
                  </span>
                </div>
              )) : (
                <span className="text-text-ghost text-[10px] col-span-2">— unavailable</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secondary metadata */}
      {ready && (
        <div className="mt-2 pt-2 border-t border-border text-[10px] text-text-ghost">
          chunks: {project.meta.chunks} · tokens: {project.meta.tokens}
        </div>
      )}
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
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
        <span className="font-mono text-[11px] text-accent">{project.status}</span>
      </div>

      {/* Name + GitHub */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="font-display text-[24px] sm:text-[28px] text-text-primary leading-tight">
          {project.name}
        </h3>
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] text-text-ghost border border-border rounded px-2 py-1 hover:border-accent hover:text-accent transition-colors shrink-0 mt-1"
        >
          ↗ github
        </a>
      </div>

      {/* Description */}
      <p className="font-body text-[15px] text-text-muted mb-5">
        {project.description}
      </p>

      {/* Stats block with typewriter */}
      <StatsBlock project={project} isInView={isInView} />

      {/* Stack tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="font-mono text-[11px] text-text-primary border border-border rounded-full px-[10px] py-[3px] inline-block"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Doc sources only */}
      <div className="flex gap-4 pt-4 border-t border-border">
        {project.docSources.map((src) =>
          src.url ? (
            <a
              key={src.name}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-text-ghost hover:text-accent transition-colors"
            >
              ← {src.name}
            </a>
          ) : (
            <span key={src.name} className="font-mono text-[10px] text-text-ghost opacity-40">
              ← {src.name}
            </span>
          )
        )}
      </div>

      {/* Connector line */}
      <svg
        className="absolute -left-8 top-1/2 w-8 h-[1px] hidden lg:block"
        viewBox="0 0 32 1"
      >
        <line x1="0" y1="0.5" x2="32" y2="0.5" stroke="var(--text-ghost)" strokeWidth="1" opacity="0.4" />
      </svg>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Projects() {
  const { ref: headerRef, isInView: headerInView } = useInView();

  return (
    <section id="projects" className="section-padding bg-bg">
      <div className="max-w-content mx-auto">
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

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:w-[30%] p-6 border border-border rounded bg-bg overflow-x-auto"
          >
            <FileTree startScan={headerInView} />
          </motion.div>

          <div className="lg:w-[70%] space-y-8">
            {projects.map((project, i) => (
              <ProjectCard key={project.name} project={project} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
