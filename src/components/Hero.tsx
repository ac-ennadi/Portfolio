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
        { y: 16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.08, ease: "power2.out" }
      );
    },
    { scope: root }
  );

  return (
    <section className="hero section" id="top" ref={root}>
      <div className="hero-copy">
        <p className="hero-kicker hero-enter">Software Engineering & Video Direction</p>
        <h1 className="hero-enter">
          Engineering systems.<br />
          <em>Directing visuals.</em>
        </h1>
        <p className="hero-sub hero-enter">
          Software engineering student at UM6P in Benguerir. I build low-level C/C++ programs, web apps, and direct commercial video.
        </p>
        <div className="hero-actions hero-enter">
          <a href="#work" className="button button-primary">
            View Projects <span>↘</span>
          </a>
          <button className="button button-quiet" onClick={openPalette} type="button">
            Command Palette <span>⌘K</span>
          </button>
        </div>
        <p className="hero-foot hero-enter">
          Based in Benguerir, Morocco.
        </p>
      </div>

      <div className="portrait-wrap hero-enter">
        <div className="portrait-image">
          <Image
            src="/images/achraf-portrait.png"
            alt="Achraf Ennadiri"
            fill
            priority
            sizes="(max-width: 760px) 90vw, 42vw"
          />
        </div>
      </div>
    </section>
  );
}
