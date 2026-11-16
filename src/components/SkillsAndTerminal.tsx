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
    title: "SYSTEMS & INFRASTRUCTURE",
    skills: ["Linux / Unix", "Docker", "PostgreSQL", "Git", "REST APIs", "CI/CD"],
  },
];

const creative = [
  {
    title: "POST-PRODUCTION",
    skills: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Color Grading"],
  },
  {
    title: "INTERACTIVE & UI",
    skills: ["Design Systems", "GSAP Animations", "Tailwind v4", "Raycast UI Specs"],
  },
  {
    title: "DIRECTION & PRODUCTION",
    skills: ["Commercial Video", "Storyboarding", "Audio Engineering", "Brand Direction"],
  },
];

export default function SkillsAndTerminal() {
  return (
    <section className="section" id="capabilities">
      <div className="section-heading">
        <p className="eyebrow">02 / Capabilities</p>
        <h2>Technical Stack & Direction</h2>
        <p className="section-note">
          Engineering disciplines and post-production tools applied to real-world products.
        </p>
      </div>

      <div className="skills-grid">
        {[
          { title: "Systems & Software Engineering", groups: engineering },
          { title: "Visual Direction & Production", groups: creative },
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
