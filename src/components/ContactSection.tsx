"use client";

import { useState, type FormEvent } from "react";

const scopes = ["Engineering & Systems", "Commercial Video", "Both / Full Project"];
const email = "achrafennadiri@gmail.com";

export default function ContactSection() {
  const [scope, setScope] = useState(scopes[2]);
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
        <p className="eyebrow">04 / Contact</p>
        <h2>Initiate Contact</h2>
        <p className="section-note">
          Have an engineering or production brief? Dispatch a message below.
        </p>
      </div>

      <div className="contact-grid">
        <form className="contact-form" onSubmit={submit}>
          {opened ? (
            <div className="form-success" role="status">
              <p className="eyebrow">Status: Draft Dispatched</p>
              <h3>Your default mail client has opened.</h3>
              <p>If your mail client didn’t launch automatically, use the direct copy action to send your note.</p>
              <button
                className="button button-quiet"
                type="button"
                onClick={() => setOpened(false)}
              >
                Modify message
              </button>
            </div>
          ) : (
            <>
              <div>
                <p className="form-label" style={{ marginBottom: "12px" }}>
                  Project Domain
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
                    placeholder="Achraf Ennadiri"
                    autoComplete="name"
                  />
                </label>
                <label>
                  Email Address
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="achraf@example.com"
                    autoComplete="email"
                  />
                </label>
              </div>

              <label>
                Project Scope & Details
                <textarea
                  name="details"
                  required
                  minLength={12}
                  rows={4}
                  placeholder="Outline the technical requirements, timeline, or visual expectations…"
                />
              </label>

              <button className="button button-primary" type="submit" style={{ alignSelf: "flex-start" }}>
                Send Project Brief <span>↗</span>
              </button>
            </>
          )}
        </form>

        <aside className="contact-aside">
          <p className="form-label" style={{ marginBottom: "12px" }}>Direct Channel</p>
          <button className="email-copy" onClick={copy} type="button">
            <span>{email}</span>
            <span>{copied ? "Copied ✓" : "Copy ⌘C"}</span>
          </button>

          <div className="social-list">
            <p className="form-label" style={{ marginBottom: "8px" }}>Network & Profiles</p>
            <a href="https://github.com/achrafennadiri" target="_blank" rel="noreferrer">
              GitHub <span>github.com/achrafennadiri ↗</span>
            </a>
            <a href="https://www.linkedin.com/in/achrafennadiri/" target="_blank" rel="noreferrer">
              LinkedIn <span>in/achrafennadiri ↗</span>
            </a>
            <a href="https://www.instagram.com/achrafennadiri/" target="_blank" rel="noreferrer">
              Instagram <span>@achrafennadiri ↗</span>
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
