"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsAndTerminal from "@/components/SkillsAndTerminal";
import TimelineSection from "@/components/TimelineSection";
import ContactSection from "@/components/ContactSection";
import CommandPalette from "@/components/CommandPalette";
import InteractiveShader from "@/components/InteractiveShader";

export default function Page() {
  return (
    <>
      <InteractiveShader />
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
          <span>Software Engineer & Video Editor</span>
          <span className="footer-pipe">·</span>
          <span>Benguerir, Morocco</span>
        </div>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </>
  );
}
