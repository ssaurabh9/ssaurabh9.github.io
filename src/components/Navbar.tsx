"use client";

import { useState, useEffect, useRef } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useActiveSection } from "@/hooks/useActiveSection";

export default function Navbar() {
  const progress = useScrollProgress();
  const { activeQuery } = useActiveSection();
  const [displayedQuery, setDisplayedQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const prevQueryRef = useRef(activeQuery);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (activeQuery === prevQueryRef.current && displayedQuery.length > 0) return;
    prevQueryRef.current = activeQuery;

    // Clear existing timeouts
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[52px] bg-bg border-b border-border">
      <div className="max-w-content mx-auto h-full flex items-center justify-between px-6">
        {/* LEFT */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-[11px] text-text-muted">[SYS]</span>
          <span className="font-body text-[14px] text-text-primary">
            Saurabh Sachdev
          </span>
        </div>

        {/* CENTER — Query Bar */}
        <div className="hidden md:flex items-center justify-center flex-1 mx-8">
          <div className="rounded border border-border px-[14px] py-[6px] w-[420px] max-w-full">
            <span className="font-mono text-[12px] text-text-muted">
              {">"} {displayedQuery}
              {isTyping && (
                <span className="animate-blink text-accent ml-[1px]">
                  &#9612;
                </span>
              )}
            </span>
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
