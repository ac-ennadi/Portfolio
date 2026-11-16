"use client";
import {useRef} from "react";
import Image from "next/image";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";

function openPalette(){window.dispatchEvent(new Event("portfolio:open-palette"))}
export default function Hero(){
 const root=useRef<HTMLElement>(null);
 useGSAP(()=>{gsap.fromTo(".hero-enter",{y:24,autoAlpha:0},{y:0,autoAlpha:1,duration:.75,stagger:.1,ease:"power3.out"})},{scope:root});
 return <section className="hero section" id="top" ref={root}>
  <div className="hero-copy">
   <p className="hero-kicker hero-enter">SOFTWARE ENGINEER <span>×</span> CREATIVE DIRECTOR</p>
   <h1 className="hero-enter">Engineering systems.<br/><em>Directing visuals.</em></h1>
   <p className="hero-sub hero-enter">Software Engineer at UM6P and Commercial Creative Director building low-level C/C++ engines, full-stack web apps, and high-impact brand visuals.</p>
   <div className="hero-actions hero-enter"><a href="#work" className="button button-primary">Explore Selected Work <span>↘</span></a><button className="button button-quiet" onClick={openPalette}>Open Command Palette <span>⌘K</span></button></div>
   <div className="hero-foot hero-enter"><span>v2026.11</span><span>|</span><span>UM6P BENGUERIR</span><span>|</span><span>SYSTEMS & MOTION</span></div>
  </div>
  <div className="portrait-window hero-enter"><div className="window-chrome"><span className="window-dots"><i/><i/><i/></span><span>achraf_ennadiri.raw — UM6P</span><span className="window-live">● LIVE</span></div><div className="portrait-image"><Image src="/images/achraf-portrait.png" alt="Achraf Ennadiri in a softly lit studio" fill priority sizes="(max-width: 760px) 90vw, 46vw"/><div className="portrait-vignette"/></div><div className="portrait-badge"><i/><span>BEN GUERIR, MA <b>·</b> AVAILABLE FOR ENGINEERING & CREATIVE</span></div></div>
 </section>
}
