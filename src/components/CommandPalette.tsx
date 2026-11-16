"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Command = {
  label: string;
  detail: string;
  kind: "section" | "filter" | "copy";
  value: string;
};

const commands: Command[] = [
  { label: "All Projects", detail: "Display complete body of work", kind: "filter", value: "all" },
  { label: "Systems & Low-Level", detail: "C/C++, Unix, Graphics engines", kind: "filter", value: "systems" },
  { label: "Full-Stack Web", detail: "Next.js, TypeScript, Backend services", kind: "filter", value: "fullstack" },
  { label: "Commercial & Video", detail: "Video editing, motion, and visual direction", kind: "filter", value: "creative" },
  { label: "Jump to Work", detail: "Navigate to selected projects", kind: "section", value: "work" },
  { label: "Jump to Capabilities", detail: "Review technical stack & tools", kind: "section", value: "capabilities" },
  { label: "Jump to Experience", detail: "Review timeline & education", kind: "section", value: "experience" },
  { label: "Jump to Contact", detail: "Initiate project inquiry", kind: "section", value: "contact" },
  { label: "Copy Email Address", detail: "achrafennadiri@gmail.com", kind: "copy", value: "achrafennadiri@gmail.com" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () =>
      commands.filter((c) =>
        `${c.label} ${c.detail}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const run = useCallback(
    async (command: Command) => {
      if (command.kind === "filter") {
        window.dispatchEvent(new CustomEvent("portfolio:filter", { detail: command.value }));
        document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
      } else if (command.kind === "section") {
        document.getElementById(command.value)?.scrollIntoView({ behavior: "smooth" });
      } else {
        try {
          await navigator.clipboard.writeText(command.value);
        } catch {}
      }
      close();
    },
    [close]
  );

  useEffect(() => {
    function key(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        close();
      } else if (open && e.key === "ArrowDown") {
        e.preventDefault();
        setActive((v) => (filtered.length ? (v + 1) % filtered.length : 0));
      } else if (open && e.key === "ArrowUp") {
        e.preventDefault();
        setActive((v) => (filtered.length ? (v - 1 + filtered.length) % filtered.length : 0));
      } else if (open && e.key === "Enter" && filtered[active]) {
        e.preventDefault();
        void run(filtered[active]);
      }
    }

    function show() {
      setOpen(true);
    }

    window.addEventListener("keydown", key);
    window.addEventListener("portfolio:open-palette", show);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("portfolio:open-palette", show);
    };
  }, [active, close, filtered, open, run]);

  useEffect(() => {
    if (open) {
      setActive(0);
      window.setTimeout(() => input.current?.focus(), 25);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="palette-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <section className="command-palette" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="palette-search">
          <span>⌕</span>
          <input
            ref={input}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Type a command or jump to section…"
          />
          <kbd>ESC</kbd>
        </div>

        <p className="palette-label">NAVIGATION & ACTIONS</p>

        <div className="palette-results" role="listbox">
          {filtered.map((c, i) => (
            <button
              role="option"
              aria-selected={active === i}
              className={`palette-row ${active === i ? "selected" : ""}`}
              key={`${c.kind}-${c.value}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => void run(c)}
              type="button"
            >
              <span className="palette-symbol">
                {c.kind === "section" ? "↗" : c.kind === "filter" ? "⌘" : "▣"}
              </span>
              <span className="palette-row-copy">
                <b>{c.label}</b>
                <small>{c.detail}</small>
              </span>
              <span className="palette-enter">↵</span>
            </button>
          ))}
          {filtered.length === 0 && <p className="palette-empty">No matching commands found.</p>}
        </div>

        <footer className="palette-footer">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> NAVIGATE
          </span>
          <span>
            <kbd>↵</kbd> SELECT
          </span>
          <span>
            ACHRAF ENNADIRI <b>◆</b>
          </span>
        </footer>
      </section>
    </div>
  );
}
