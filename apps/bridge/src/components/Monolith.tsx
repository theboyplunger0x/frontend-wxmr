"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useDesignMotion } from "./DesignEffects";

export function Monolith() {
  const stage = useRef<HTMLDivElement>(null);
  const object = useRef<HTMLButtonElement>(null);
  const [flipped, setFlipped] = useState(false);
  const {enabled} = useDesignMotion();
  const id = useId().replace(/:/g, "");
  useEffect(() => {
    const area = stage.current, card = object.current;
    if (!area || !card || !enabled) return;
    let frame=0, visible=false, hovering=false, px=.4, py=.4, x=6, y=-12, last=0, time=0;
    const draw = (now: number) => {
      frame=0; if (!visible || document.hidden) { last=0; return; }
      const dt=last?Math.min((now-last)/1000,.05):.016; last=now; time+=dt;
      const a=hovering?(0.5-py)*12:6+Math.sin(time*.65)*4;
      const b=hovering?(px-.5)*18-7:-10+Math.sin(time*.55)*7;
      const ease=1-Math.exp(-dt*5); x+=(a-x)*ease; y+=(b-y)*ease;
      card.style.setProperty("--float-y", `${Math.sin(time*.65)*6}px`);
      card.style.setProperty("--tilt-x", `${x}deg`); card.style.setProperty("--tilt-y", `${y}deg`);
      card.style.setProperty("--shine-x", `${hovering?px*100:40+Math.sin(time*.4)*20}%`);
      card.style.setProperty("--shine-y", `${hovering?py*100:30+Math.cos(time*.4)*17}%`);
      frame=requestAnimationFrame(draw);
    };
    const start=()=>{if(visible&&!document.hidden&&!frame)frame=requestAnimationFrame(draw);};
    const stop=()=>{cancelAnimationFrame(frame);frame=0;last=0;};
    const move=(event: PointerEvent)=>{if(event.pointerType==="touch")return;const box=area.getBoundingClientRect();px=Math.max(0,Math.min(1,(event.clientX-box.left)/box.width));py=Math.max(0,Math.min(1,(event.clientY-box.top)/box.height));hovering=true;};
    const leave=()=>{hovering=false;};
    const visibility=()=>document.hidden?stop():start();
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;visible?start():stop();},{threshold:.05});observer.observe(area);
    area.addEventListener("pointermove",move,{passive:true});area.addEventListener("pointerleave",leave);document.addEventListener("visibilitychange",visibility);
    return ()=>{stop();observer.disconnect();area.removeEventListener("pointermove",move);area.removeEventListener("pointerleave",leave);document.removeEventListener("visibilitychange",visibility);card.style.removeProperty("--tilt-x");card.style.removeProperty("--tilt-y");card.style.removeProperty("--float-y");};
  }, [enabled]);
  return <div className="monolith-stage" ref={stage}>
    
    <div className="artifact-halo" aria-hidden="true" />
    <div className="artifact-orbit" aria-hidden="true" />
    <button ref={object} type="button" className="monolith" aria-label={flipped?"Show native Monero face":"Show wrapped XMR face"} aria-pressed={flipped} onClick={()=>setFlipped(!flipped)}>
      <span className={`monolith-turn ${flipped?"is-flipped":""}`}>
        {[false,true].map(back=><span key={String(back)} className={`monolith-face ${back?"monolith-back":""}`}>
          <span className="artifact-grain" /><span className="artifact-contours" />
          <span className="artifact-wordmark">wXMR<span>.</span></span>
          <span className="artifact-mark"><svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id={`${id}-${back?"w":"m"}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d0d0d0"/><stop offset=".3" stopColor="#777"/><stop offset=".58" stopColor="#282828"/><stop offset="1" stopColor="#b0b0b0"/></linearGradient></defs>{back?<path d="M35 60h130v16H35zm0 30h130v12l-33 49-32-36-32 36-33-49V90zm23 16 13 19 29-34 29 34 13-19z" fill={`url(#${id}-w)`}/>:<path d="M25 55v96h43v-42l32 32 32-32v42h43V55l-75 75z" fill={`url(#${id}-m)`}/>}</svg></span>
          <span className="artifact-caption"><span>{back?"Wrapped XMR":"Native Monero"}</span><span>{back?"Solana":"XMR"}</span></span>
          <span className="artifact-shine" />
        </span>)}
      </span>
    </button>
    <div className="artifact-switch" aria-hidden="true"><span className={!flipped?"selected":""}>Monero</span><span className="artifact-switch-line"/><span className={flipped?"selected":""}>Solana</span></div>
  </div>;
}
