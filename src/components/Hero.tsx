"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function openPalette() {
  window.dispatchEvent(new Event("portfolio:open-palette"));
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".hero-enter",
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" }
      );
    },
    { scope: root }
  );

  return (
    <section className="hero section" id="top" ref={root}>
      <div className="hero-copy">
        <p className="hero-kicker hero-enter">Software Engineering & Visual Systems</p>
        <h1 className="hero-enter">
          Engineering systems.<br />
          <em>Directing visuals.</em>
        </h1>
        <p className="hero-sub hero-enter">
          Software engineering student at UM6P in Benguerir. Building C/C++ systems, high-performance web applications, and directing commercial video.
        </p>
        <div className="hero-actions hero-enter">
          <a href="#work" className="button button-primary">
            Explore Selected Work <span>↘</span>
          </a>
          <button className="button button-quiet" onClick={openPalette} type="button">
            Command Palette <span>⌘K</span>
          </button>
        </div>
        <p className="hero-foot hero-enter">
          v1.0.4 · Ben Guerir, Morocco · Full-Stack & Systems · Press ⌘K
        </p>
      </div>

      <figure className="portrait-window hero-enter">
        <div className="window-chrome">
          <div className="window-dots">
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </div>
          <span>achraf_ennadiri.sys</span>
          <span style={{ color: "var(--color-coral-pulse)" }}>LIVE</span>
        </div>
        <div className="portrait-image">
          <Image
            src="/images/achraf-portrait.png"
            alt="Achraf Ennadiri in a softly lit studio"
            fill
            priority
            sizes="(max-width: 760px) 90vw, 46vw"
          />
        </div>
        <figcaption>Achraf Ennadiri · UM6P Benguerir, Morocco</figcaption>
      </figure>
    </section>
  );
}
