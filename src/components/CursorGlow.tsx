"use client";

import {useEffect,useRef} from "react";

type Trail={x:number;y:number;length:number;direction:number;curve:number;born:number};

export default function CursorGlow(){
 const canvasRef=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=canvasRef.current;
  const context=canvas?.getContext("2d");
  if(!canvas||!context||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const root=document.documentElement;
  const trails:Trail[]=[];
  const pointer={x:0,y:0,known:false};
  let width=window.innerWidth,height=window.innerHeight,dpr=1,frame=0,lastScroll=window.scrollY,lastTrail=0;

  const resize=()=>{width=window.innerWidth;height=window.innerHeight;dpr=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;context.setTransform(dpr,0,0,dpr,0,0)};
  const draw=(now:number)=>{
   context.clearRect(0,0,width,height);
   for(let i=trails.length-1;i>=0;i--){
    const trail=trails[i];const age=(now-trail.born)/640;
    if(age>=1){trails.splice(i,1);continue}
    const progress=Math.min(1,age*2.5);const alpha=Math.sin(age*Math.PI)*.62;
    context.beginPath();
    for(let step=0;step<=16*progress;step++){
     const t=step/16;const x=trail.x+trail.curve*t*t;const y=trail.y+trail.direction*trail.length*t;
     if(step===0)context.moveTo(x,y);else context.lineTo(x,y);
    }
    context.strokeStyle=`rgba(255,99,99,${alpha})`;context.lineWidth=1.15;context.lineCap="round";context.stroke();
   }
   if(trails.length)frame=requestAnimationFrame(draw);else frame=0;
  };
  const wake=()=>{if(!frame)frame=requestAnimationFrame(draw)};
  const onPointerMove=(event:PointerEvent)=>{
   if(event.pointerType!=="mouse")return;
   pointer.x=event.clientX;pointer.y=event.clientY;pointer.known=true;
   root.style.setProperty("--pointer-x",`${pointer.x}px`);root.style.setProperty("--pointer-y",`${pointer.y}px`);root.style.setProperty("--pointer-alpha","1");
  };
  const onPointerLeave=()=>root.style.setProperty("--pointer-alpha","0");
  const onScroll=()=>{
   const next=window.scrollY;const delta=next-lastScroll;lastScroll=next;const now=performance.now();
   if(!pointer.known||Math.abs(delta)<2||now-lastTrail<48)return;
   lastTrail=now;const direction=Math.sign(delta);
   trails.push({x:pointer.x,y:pointer.y,length:Math.min(12+Math.abs(delta)*.32,42),direction,curve:direction*6,born:now});
   if(trails.length>14)trails.shift();wake();
  };
  resize();window.addEventListener("resize",resize,{passive:true});window.addEventListener("pointermove",onPointerMove,{passive:true});window.addEventListener("scroll",onScroll,{passive:true});document.documentElement.addEventListener("pointerleave",onPointerLeave);
  return()=>{window.removeEventListener("resize",resize);window.removeEventListener("pointermove",onPointerMove);window.removeEventListener("scroll",onScroll);document.documentElement.removeEventListener("pointerleave",onPointerLeave);if(frame)cancelAnimationFrame(frame)};
 },[]);
 return <><div className="cursor-glow" aria-hidden="true"/><canvas ref={canvasRef} className="cursor-lines" aria-hidden="true"/></>;
}
