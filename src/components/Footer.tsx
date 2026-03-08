"use client";

export default function Footer() {
  return (
    <footer className="border-t border-border py-6 px-6">
      <div className="max-w-content mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <span className="font-mono text-[11px] text-text-muted">
          [SYS] Saurabh Sachdev · © 2025
        </span>
        <span className="font-mono text-[11px] text-text-muted">
          Knowledge base last indexed: 2025
        </span>
      </div>
    </footer>
  );
}
