"use client";

import { useState, useEffect } from "react";

export type SectionId =
  | "hero"
  | "experience"
  | "projects"
  | "skills"
  | "publications"
  | "contact";

export const SECTION_LABELS: Record<SectionId, string> = {
  hero: "Home",
  experience: "Work",
  projects: "Projects",
  skills: "Skills",
  publications: "Papers",
  contact: "Contact",
};

export const SECTION_QUERIES: Record<SectionId, string> = {
  hero: 'Who is Saurabh Sachdev?',
  experience: 'Retrieve professional experience, ranked by impact...',
  projects: 'Show open source contributions...',
  skills: 'Extract and cluster technical capabilities from corpus...',
  publications: 'Query academic publications database...',
  contact: 'Generate optimal response channel for new inquiry...',
};

export const SECTION_ORDER: SectionId[] = [
  "hero",
  "experience",
  "projects",
  "skills",
  "publications",
  "contact",
];

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [activeQuery, setActiveQuery] = useState(SECTION_QUERIES.hero);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_ORDER.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(sectionId);
              setActiveQuery(SECTION_QUERIES[sectionId]);
            }
          });
        },
        { threshold: 0.15, rootMargin: "-52px 0px 0px 0px" }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return { activeSection, activeQuery };
}
