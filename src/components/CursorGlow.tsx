"use client";
import {useEffect} from "react";
export default function CursorGlow(){
 useEffect(()=>{
  const root=document.documentElement;
  let raf=0;
  let point:{x:number;y:number}|null=null;
  const move=(e:PointerEvent)=>{
   if(e.pointerType!=="mouse")return;
   point={x:e.clientX,y:e.clientY};
   if(raf)return;
   raf=requestAnimationFrame(()=>{
    if(point){root.style.setProperty("--pointer-x",`${point.x}px`);root.style.setProperty("--pointer-y",`${point.y}px`);root.style.setProperty("--pointer-alpha","1")}
    raf=0;
   });
  };
  const leave=()=>root.style.setProperty("--pointer-alpha","0");
  window.addEventListener("pointermove",move,{passive:true});
  document.documentElement.addEventListener("pointerleave",leave);
  return()=>{window.removeEventListener("pointermove",move);document.documentElement.removeEventListener("pointerleave",leave);if(raf)cancelAnimationFrame(raf)};
 },[]);
 return <div className="cursor-glow" aria-hidden="true"/>;
}
