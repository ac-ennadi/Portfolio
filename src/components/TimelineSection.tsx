import { timeline } from "@/data/portfolioData";

export default function TimelineSection() {
  return (
    <section className="section" id="experience">
      <div className="section-heading">
        <p className="eyebrow">03 / Experience</p>
        <h2>Work & Education</h2>
        <p className="section-note">
          Academic foundations, freelance production work, and software development engagements.
        </p>
      </div>

      <div className="timeline-list">
        {timeline.map((item) => (
          <article className="timeline-item" key={item.organization}>
            <p className="timeline-period">{item.period}</p>
            <div className="timeline-content">
              <h3>{item.title}</h3>
              <h4>{item.organization}</h4>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
