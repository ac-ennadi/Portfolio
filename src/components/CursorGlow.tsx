"use client";

import {useEffect,useRef} from "react";

type Bloom={x:number;y:number;radius:number;rotation:number;direction:number;born:number;hue:number};

export default function CursorGlow(){
 const canvasRef=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=canvasRef.current;
  const context=canvas?.getContext("2d");
  if(!canvas||!context||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const root=document.documentElement;
  const blooms:Bloom[]=[];
  const pointer={x:window.innerWidth/2,y:window.innerHeight/2,known:false};
  let width=window.innerWidth,height=window.innerHeight,dpr=1,frame=0,lastScroll=window.scrollY,lastBloom=0;

  const resize=()=>{width=window.innerWidth;height=window.innerHeight;dpr=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;context.setTransform(dpr,0,0,dpr,0,0)};
  const draw=(now:number)=>{
   context.clearRect(0,0,width,height);
   for(let index=blooms.length-1;index>=0;index--){
    const bloom=blooms[index];const elapsed=now-bloom.born;const progress=elapsed/1050;
    if(progress>=1){blooms.splice(index,1);continue}
    const eased=1-Math.pow(1-progress,2);const alpha=Math.sin(progress*Math.PI)*.33;const drawn=Math.min(1,progress*2.7);const steps=Math.max(3,Math.floor(88*drawn));
    const rotation=bloom.rotation+bloom.direction*progress*.65;
    context.beginPath();
    for(let step=0;step<=steps;step++){
     const angle=(step/88)*Math.PI*2;
     const contour=.78+.16*Math.cos(5*angle)+.06*Math.sin(3*angle+progress*4);
     const radius=bloom.radius*(.48+eased*.52)*contour;
     const x=bloom.x+Math.cos(angle+rotation)*radius;
     const y=bloom.y+Math.sin(angle+rotation)*radius;
     if(step===0)context.moveTo(x,y);else context.lineTo(x,y);
    }
    if(drawn>=1)context.closePath();
    context.strokeStyle=bloom.hue===0?`rgba(255,99,99,${alpha})`:`rgba(99,161,255,${alpha*.8})`;
    context.lineWidth=1.1;
    context.stroke();
    context.beginPath();context.arc(bloom.x,bloom.y,1.5+progress*1.5,0,Math.PI*2);context.fillStyle=`rgba(230,230,230,${alpha*.8})`;context.fill();
   }
   if(blooms.length)frame=requestAnimationFrame(draw);else frame=0;
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
   if(!pointer.known||Math.abs(delta)<2||now-lastBloom<95)return;
   lastBloom=now;
   blooms.push({x:pointer.x,y:pointer.y,radius:25+Math.min(Math.abs(delta)*.11,30),rotation:next*.002,direction:Math.sign(delta)||1,born:now,hue:Math.abs(Math.round(next/180))%2});
   if(blooms.length>8)blooms.shift();
   wake();
  };
  resize();
  window.addEventListener("resize",resize,{passive:true});
  window.addEventListener("pointermove",onPointerMove,{passive:true});
  window.addEventListener("scroll",onScroll,{passive:true});
  document.documentElement.addEventListener("pointerleave",onPointerLeave);
  return()=>{window.removeEventListener("resize",resize);window.removeEventListener("pointermove",onPointerMove);window.removeEventListener("scroll",onScroll);document.documentElement.removeEventListener("pointerleave",onPointerLeave);if(frame)cancelAnimationFrame(frame)};
 },[]);
 return <><div className="cursor-glow" aria-hidden="true"/><canvas ref={canvasRef} className="cursor-shapes" aria-hidden="true"/></>;
}
