const engineering = [
  {
    title: "LANGUAGES",
    skills: ["C", "C++", "Python", "Java", "TypeScript", "SQL"],
  },
  {
    title: "FRAMEWORKS & RUNTIMES",
    skills: ["React", "Next.js", "Node.js", "Spring Boot", "FastAPI", "Tailwind CSS"],
  },
  {
    title: "SYSTEMS & TOOLS",
    skills: ["Linux / Unix", "Docker", "PostgreSQL", "Git", "REST APIs"],
  },
];

const creative = [
  {
    title: "POST-PRODUCTION",
    skills: ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve", "Color Grading"],
  },
  {
    title: "INTERACTIVE & WEB",
    skills: ["GSAP Animations", "UI Systems", "Responsive Design"],
  },
  {
    title: "VIDEO & DIRECTION",
    skills: ["Commercial Video", "Storyboarding", "Audio Post"],
  },
];

export default function SkillsAndTerminal() {
  return (
    <section className="section" id="capabilities">
      <div className="section-heading">
        <p className="eyebrow">Skills</p>
        <h2>Technical & Creative Skills</h2>
        <p className="section-note">
          Languages, frameworks, and production tools I use day to day.
        </p>
      </div>

      <div className="skills-grid">
        {[
          { title: "Software & Systems", groups: engineering },
          { title: "Video & Motion", groups: creative },
        ].map((card) => (
          <article className="skill-card" key={card.title}>
            <h3>{card.title}</h3>
            {card.groups.map((g) => (
              <div className="skill-group" key={g.title}>
                <p>{g.title}</p>
                <div className="skill-list">
                  {g.skills.map((s, i) => (
                    <span key={s}>
                      {i > 0 && <i aria-hidden="true">·</i>}
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
