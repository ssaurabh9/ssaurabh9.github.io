"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

const chunks = [
  {
    id: "chunk_01 · past_project_brief.pdf",
    text: "Typical response time: within 24 hours",
  },
  {
    id: "chunk_02 · consulting_terms.pdf",
    text: "Preferred first contact: email",
  },
];

const contactLinks = [
  { label: "s.sachdev151@gmail.com", href: "mailto:s.sachdev151@gmail.com" },
  {
    label: "linkedin.com/in/im-saurabh-sachdev",
    href: "https://linkedin.com/in/im-saurabh-sachdev",
  },
  { label: "github.com/ssaurabh9", href: "https://github.com/ssaurabh9" },
];

export default function Contact() {
  const { ref: headerRef, isInView: headerInView } = useInView();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:s.sachdev151@gmail.com?subject=New Inquiry from ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AFrom: ${formData.email}`;
    window.location.href = mailtoLink;
  };

  return (
    <section id="contact" className="section-padding bg-bg relative overflow-hidden">
      {/* Background texture — faint document outlines */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none" preserveAspectRatio="none">
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

        {/* Retrieved chunks */}
        <div className="space-y-3 mb-10">
          {chunks.map((chunk, i) => (
            <motion.div
              key={chunk.id}
              initial={{ opacity: 0, x: -10 }}
              animate={headerInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
              className="border-l border-accent pl-3"
            >
              <p className="font-mono text-[10px] text-text-ghost mb-1">
                [{chunk.id}]
              </p>
              <p className="font-mono text-[11px] text-text-muted">
                {chunk.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-[600px] space-y-6">
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
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Email"
                className="w-full bg-transparent border border-border rounded px-4 py-3 font-body text-[15px] text-text-primary placeholder:text-text-ghost focus:border-accent transition-colors"
              />
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
              Run Inference →
            </button>
          </motion.div>
        </form>

        {/* Contact links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-wrap gap-3 mt-8"
        >
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-text-muted border border-border rounded-full px-3 py-[4px] hover:border-accent hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
