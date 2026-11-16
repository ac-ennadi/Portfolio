"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import gsap from "gsap";
import {projects,type ProjectCategory,type Project} from "@/data/portfolioData";
import ProjectThumbnail from "@/components/ProjectThumbnail";
import ProjectModal from "@/components/ProjectModal";

const filters:{label:string;value:ProjectCategory|"all"}[]=[{label:"All work",value:"all"},{label:"Systems & Low-Level",value:"systems"},{label:"Full-Stack Web",value:"fullstack"},{label:"Creative & Commercial",value:"creative"}];
export default function ProjectsSection(){
 const[filter,setFilter]=useState<ProjectCategory|"all">("all");
 const[selected,setSelected]=useState<Project|null>(null);
 const grid=useRef<HTMLDivElement>(null);
 const visible=useMemo(()=>projects.filter(p=>filter==="all"||p.category===filter),[filter]);
 useEffect(()=>{const handler=(event:Event)=>{const value=(event as CustomEvent<string>).detail;if(["all","systems","fullstack","creative"].includes(value))setFilter(value as ProjectCategory|"all")};window.addEventListener("portfolio:filter",handler);return()=>window.removeEventListener("portfolio:filter",handler)},[]);
 useEffect(()=>{if(grid.current)gsap.fromTo(grid.current.querySelectorAll(".project-card"),{y:12,autoAlpha:0},{y:0,autoAlpha:1,duration:.32,stagger:.05,ease:"power2.out"})},[visible]);
 return <section className="section projects-section" id="work"><div className="section-heading"><div><p className="eyebrow">Selected work</p><h2>Projects</h2></div><p className="section-note">Software I’ve built and video work I’ve directed.</p></div><div className="filter-row" role="group" aria-label="Filter projects">{filters.map(f=><button key={f.value} className={filter===f.value?"filter active":"filter"} onClick={()=>setFilter(f.value)}>{f.label}</button>)}</div><div className="project-grid" ref={grid}>{visible.map(p=><button className="project-card" key={p.id} onClick={()=>setSelected(p)}><ProjectThumbnail type={p.visualType}/><div className="project-meta"><span>{p.category==="fullstack"?"Web":p.category==="systems"?"Systems":"Video"}</span><span>{p.year}</span></div><h3>{p.title}<span>↗</span></h3><p>{p.subtitle}</p><p className="project-stack">{p.stack.slice(0,4).join(" · ")}</p></button>)}</div><ProjectModal project={selected} onClose={()=>setSelected(null)}/></section>
}
