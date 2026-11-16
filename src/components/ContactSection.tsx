"use client";

import { useState, type FormEvent } from "react";

const scopes = ["Software & Web", "Commercial Video", "Both"];
const email = "achrafennadiri@gmail.com";

export default function ContactSection() {
  const [scope, setScope] = useState(scopes[0]);
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = `Project inquiry — ${scope}`;
    const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("details")}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }

  return (
    <section className="section" id="contact">
      <div className="section-heading">
        <p className="eyebrow">Contact</p>
        <h2>Get in Touch</h2>
        <p className="section-note">
          Have a software project, internship opportunity, or video edit in mind? Let’s talk.
        </p>
      </div>

      <div className="contact-grid">
        <form className="contact-form" onSubmit={submit}>
          {opened ? (
            <div className="form-success" role="status">
              <p className="eyebrow">Email Prepared</p>
              <h3>Opening your email client...</h3>
              <p>If your email app didn’t open, you can copy the address on the right to reach me directly.</p>
              <button
                className="button button-quiet"
                type="button"
                onClick={() => setOpened(false)}
              >
                Back to form
              </button>
            </div>
          ) : (
            <>
              <div>
                <p className="form-label" style={{ marginBottom: "12px" }}>
                  What are you looking for?
                </p>
                <div className="scope-pills">
                  {scopes.map((s) => (
                    <button
                      type="button"
                      key={s}
                      className={scope === s ? "scope active" : "scope"}
                      onClick={() => setScope(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <input type="hidden" name="scope" value={scope} />

              <div className="input-row">
                <label>
                  Your Name
                  <input
                    name="name"
                    required
                    minLength={2}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </label>
                <label>
                  Email Address
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </label>
              </div>

              <label>
                Message
                <textarea
                  name="details"
                  required
                  minLength={12}
                  rows={4}
                  placeholder="Tell me a bit about the project, role, or timeline…"
                />
              </label>

              <button className="button button-primary" type="submit" style={{ alignSelf: "flex-start" }}>
                Send Email <span>↗</span>
              </button>
            </>
          )}
        </form>

        <aside className="contact-aside">
          <p className="form-label" style={{ marginBottom: "12px" }}>Direct Email</p>
          <button className="email-copy" onClick={copy} type="button">
            <span>{email}</span>
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <div className="social-list">
            <p className="form-label" style={{ marginBottom: "8px" }}>Links</p>
            <a href="https://github.com/ac-ennadi" target="_blank" rel="noreferrer">
              GitHub <span>github.com/ac-ennadi ↗</span>
            </a>
            <a href="https://www.linkedin.com/in/achraf-ennadiri/" target="_blank" rel="noreferrer">
              LinkedIn <span>in/achraf-ennadiri ↗</span>
            </a>
            <a href="https://www.instagram.com/ac_ennadi/" target="_blank" rel="noreferrer">
              Instagram <span>@ac_ennadi ↗</span>
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
