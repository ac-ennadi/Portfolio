"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { projects, type ProjectCategory, type Project } from "@/data/portfolioData";
import ProjectThumbnail from "@/components/ProjectThumbnail";
import ProjectModal from "@/components/ProjectModal";

const filters: { label: string; value: ProjectCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Systems & C/C++", value: "systems" },
  { label: "Web", value: "fullstack" },
  { label: "Video", value: "creative" },
];

export default function ProjectsSection() {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const grid = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () => projects.filter((p) => filter === "all" || p.category === filter),
    [filter]
  );

  useEffect(() => {
    const handler = (event: Event) => {
      const value = (event as CustomEvent<string>).detail;
      if (["all", "systems", "fullstack", "creative"].includes(value)) {
        setFilter(value as ProjectCategory | "all");
      }
    };
    window.addEventListener("portfolio:filter", handler);
    return () => window.removeEventListener("portfolio:filter", handler);
  }, []);

  useEffect(() => {
    if (grid.current) {
      gsap.fromTo(
        grid.current.querySelectorAll(".project-card"),
        { y: 12, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.28, stagger: 0.04, ease: "power2.out" }
      );
    }
  }, [visible]);

  return (
    <section className="section" id="work">
      <div className="section-heading">
        <p className="eyebrow">Work</p>
        <h2>Selected Projects</h2>
        <p className="section-note">
          Software I’ve written in C/C++, full-stack web platforms, and commercial video work.
        </p>
      </div>

      <div className="filter-row" role="group" aria-label="Filter projects">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            className={filter === f.value ? "filter active" : "filter"}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="project-grid" ref={grid}>
        {visible.map((p) => (
          <button
            className="project-card"
            key={p.id}
            onClick={() => setSelected(p)}
            type="button"
          >
            <ProjectThumbnail type={p.visualType} />
            <div className="project-meta">
              <span>{p.category === "fullstack" ? "Web" : p.category === "systems" ? "C/C++" : "Video"}</span>
              <span>{p.year}</span>
            </div>
            <h3>
              {p.title}
              <span>↗</span>
            </h3>
            <p>{p.subtitle}</p>
            <div className="tags">
              {p.stack.slice(0, 3).map((s) => (
                <span className="tag" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
