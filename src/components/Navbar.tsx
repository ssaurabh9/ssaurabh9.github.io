"use client";

import { useState, useEffect, useRef } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useActiveSection, SECTION_QUERIES, SECTION_LABELS, SECTION_ORDER } from "@/hooks/useActiveSection";

export default function Navbar() {
  const progress = useScrollProgress();
  const { activeSection, activeQuery } = useActiveSection();
  const [displayedQuery, setDisplayedQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const prevQueryRef = useRef(activeQuery);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeQuery === prevQueryRef.current && displayedQuery.length > 0) return;
    prevQueryRef.current = activeQuery;

    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    setDisplayedQuery("");
    setIsTyping(true);

    const fullText = activeQuery;
    for (let i = 0; i <= fullText.length; i++) {
      const timeout = setTimeout(() => {
        setDisplayedQuery(fullText.slice(0, i));
        if (i === fullText.length) {
          const endTimeout = setTimeout(() => setIsTyping(false), 2000);
          timeoutRefs.current.push(endTimeout);
        }
      }, i * 40);
      timeoutRefs.current.push(timeout);
    }

    return () => {
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[52px] bg-bg border-b border-border">
      <div className="max-w-content mx-auto h-full flex items-center justify-between px-6 gap-4">
        {/* LEFT */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-[11px] text-text-muted">[SYS]</span>
          <span className="font-body text-[14px] text-text-primary">
            Saurabh Sachdev
          </span>
        </div>

        {/* CENTER — Query Bar with Dropdown */}
        <div className="hidden md:flex items-center justify-center flex-1 mx-4">
          <div className="relative max-w-full" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className={`rounded border border-border px-[14px] py-[6px] overflow-hidden text-left cursor-pointer hover:border-accent transition-all duration-200 max-w-full ${
                dropdownOpen ? "w-[560px]" : ""
              }`}
            >
              <div className="relative font-mono text-[12px] text-text-muted">
                {/* Invisible sizer — sets button width to full query when closed */}
                {!dropdownOpen && (
                  <div className="invisible whitespace-nowrap">&gt;&nbsp;{activeQuery}&nbsp;&nbsp;▼</div>
                )}
                {dropdownOpen && <div className="invisible whitespace-nowrap">&nbsp;</div>}
                {/* Visible typing overlay */}
                <div className="absolute inset-0 flex items-center gap-[6px] whitespace-nowrap overflow-hidden">
                  <span className="shrink-0">&gt;</span>
                  <span>{displayedQuery}</span>
                  {isTyping && (
                    <span className="animate-blink text-accent shrink-0">&#9612;</span>
                  )}
                  <span className="ml-auto shrink-0 text-[9px] text-text-ghost pl-2">
                    {dropdownOpen ? "▲" : "▼"}
                  </span>
                </div>
              </div>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-[1px] bg-bg border border-border rounded shadow-lg z-50 overflow-hidden w-full">
              {SECTION_ORDER.map((id) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`w-full text-left px-[14px] py-[10px] font-mono text-[12px] flex items-center gap-3 transition-colors duration-100 cursor-pointer ${
                    activeSection === id
                      ? "bg-chunk-bg text-accent"
                      : "text-text-muted hover:bg-chunk-bg hover:text-text-primary"
                  }`}
                >
                  <span className="text-text-ghost text-[10px] w-[16px] shrink-0">
                    {String(SECTION_ORDER.indexOf(id)).padStart(2, "0")}
                  </span>
                  <span className="shrink-0 text-text-ghost">&gt;</span>
                  <span className="truncate">{SECTION_QUERIES[id]}</span>
                  <span className="ml-auto shrink-0 text-[10px] text-text-ghost pl-2">
                    [{SECTION_LABELS[id]}]
                  </span>
                </button>
              ))}
            </div>
          )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-[6px] w-[6px]">
            <span className="animate-pulse_dot absolute inline-flex h-full w-full rounded-full bg-accent"></span>
            <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-accent"></span>
          </span>
          <span className="font-mono text-[11px] text-text-muted hidden sm:inline">
            Available for Consulting
          </span>
        </div>
      </div>

      {/* SCROLL PROGRESS LINE */}
      <div className="absolute bottom-0 left-0 h-[1px] bg-accent transition-all duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </nav>
  );
}
