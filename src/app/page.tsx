"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsAndTerminal from "@/components/SkillsAndTerminal";
import TimelineSection from "@/components/TimelineSection";
import ContactSection from "@/components/ContactSection";
import CommandPalette from "@/components/CommandPalette";
import CursorGlow from "@/components/CursorGlow";

export default function Page() {
  return (
    <>
      <CursorGlow />
      <Navbar />
      <CommandPalette />
      <main>
        <Hero />
        <ProjectsSection />
        <SkillsAndTerminal />
        <TimelineSection />
        <ContactSection />
      </main>
      <footer className="footer">
        <a className="brand" href="#top">
          <span className="brand-mark">◆</span>
          <span>Achraf Ennadiri</span>
        </a>
        <div className="footer-meta">
          <span>v1.0.4</span>
          <span className="footer-pipe">|</span>
          <span>Ben Guerir, Morocco</span>
          <span className="footer-pipe">|</span>
          <span>Inter & Geist Mono</span>
          <span className="footer-pipe">|</span>
          <span>Next.js 15</span>
        </div>
        <span>© {new Date().getFullYear()} Achraf Ennadiri</span>
      </footer>
    </>
  );
}
