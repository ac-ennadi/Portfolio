"use client";

import {useEffect,useRef} from "react";

export default function PointerShader(){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const light=ref.current;
  if(!light||window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches)return;
  let frame=0,x=window.innerWidth/2,y=window.innerHeight/3;
  const move=(event:PointerEvent)=>{
   if(event.pointerType!=="mouse")return;
   x=event.clientX;y=event.clientY;
   if(frame)return;
   frame=requestAnimationFrame(()=>{light.style.setProperty("--light-x",`${x}px`);light.style.setProperty("--light-y",`${y}px`);light.dataset.active="true";frame=0});
  };
  const leave=()=>{light.dataset.active="false"};
  window.addEventListener("pointermove",move,{passive:true});document.documentElement.addEventListener("pointerleave",leave);
  return()=>{window.removeEventListener("pointermove",move);document.documentElement.removeEventListener("pointerleave",leave);if(frame)cancelAnimationFrame(frame)};
 },[]);
 return <div ref={ref} className="pointer-shader" aria-hidden="true"/>;
}
