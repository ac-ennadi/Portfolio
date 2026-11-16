"use client";

import {useEffect,useRef} from "react";

type Point={x:number;y:number;time:number};

export default function CursorGlow(){
 const canvasRef=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=canvasRef.current;
  const context=canvas?.getContext("2d");
  if(!canvas||!context||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const points:Point[]=[];
  let width=window.innerWidth,height=window.innerHeight,dpr=1,frame=0;

  const resize=()=>{width=window.innerWidth;height=window.innerHeight;dpr=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;context.setTransform(dpr,0,0,dpr,0,0)};
  const draw=(now:number)=>{
   context.clearRect(0,0,width,height);
   while(points.length&&now-points[0].time>560)points.shift();
   for(let i=1;i<points.length;i++){
    const a=points[i-1],b=points[i];
    const fade=Math.max(0,1-(now-b.time)/560);
    context.beginPath();context.moveTo(a.x,a.y);context.lineTo(b.x,b.y);
    context.strokeStyle=`rgba(43,177,255,${fade*.78})`;context.lineWidth=2.2*fade+.35;context.lineCap="round";context.lineJoin="round";context.stroke();
   }
   if(points.length)frame=requestAnimationFrame(draw);else frame=0;
  };
  const onPointerMove=(event:PointerEvent)=>{
   if(event.pointerType!=="mouse")return;
   const previous=points[points.length-1];
   if(previous&&Math.hypot(event.clientX-previous.x,event.clientY-previous.y)<1.5)return;
   points.push({x:event.clientX,y:event.clientY,time:performance.now()});
   if(points.length>48)points.shift();
   if(!frame)frame=requestAnimationFrame(draw);
  };
  resize();window.addEventListener("resize",resize,{passive:true});window.addEventListener("pointermove",onPointerMove,{passive:true});
  return()=>{window.removeEventListener("resize",resize);window.removeEventListener("pointermove",onPointerMove);if(frame)cancelAnimationFrame(frame)};
 },[]);
 return <canvas ref={canvasRef} className="cursor-lines" aria-hidden="true"/>;
}
