"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

const MotionContext = createContext({ enabled: false, setEnabled: (_value: boolean) => {} });
export const useDesignMotion = () => useContext(MotionContext);

export function DesignEffects({ children }: { children: ReactNode }) {
  const [enabled, setMotion] = useState(true);
  const light = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const landing = pathname === "/";
  useEffect(() => {
    // Motion is explicitly enabled for this local design review. An explicit
    // Existing browser motion preferences remain respected.
    try { setMotion(localStorage.getItem("wxmr:design-motion:v2") !== "off"); }
    catch { setMotion(true); }
  }, []);
  const setEnabled = (value: boolean) => {
    setMotion(value);
    try { localStorage.setItem("wxmr:design-motion:v2", value ? "on" : "off"); } catch { /* Still works in this tab. */ }
  };
  useEffect(() => {
    if (!enabled || !matchMedia("(pointer: fine)").matches) return;
    let frame = 0, targetX = 0, targetY = 0, x = 0, y = 0, active = false;
    let panel: HTMLElement | null = null;
    const draw = () => {
      frame = 0;
      x += (targetX - x) * .12; y += (targetY - y) * .12;
      if (light.current) {
        light.current.style.transform = `translate3d(${x - 400}px,${y - 400}px,0)`;
        light.current.style.opacity = landing ? "1" : ".35";
      }
      if (panel) {
        const box = panel.getBoundingClientRect();
        panel.style.setProperty("--light-x", `${((targetX - box.left) / box.width) * 100}%`);
        panel.style.setProperty("--light-y", `${((targetY - box.top) / box.height) * 100}%`);
      }
      if (active && Math.abs(targetX-x)+Math.abs(targetY-y) > .3) frame = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      targetX = event.clientX; targetY = event.clientY;
      if (!active) { x = targetX; y = targetY; }
      active = true;
      panel = event.target instanceof Element ? event.target.closest<HTMLElement>(".material, .transfer-card, .journey-card") : null;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const leave = () => { active = false; cancelAnimationFrame(frame); frame = 0; if (light.current) light.current.style.opacity = "0"; };
    document.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    return () => { leave(); document.removeEventListener("pointermove", move); document.documentElement.removeEventListener("pointerleave", leave); window.removeEventListener("blur", leave); };
  }, [enabled, landing]);
  return <MotionContext.Provider value={{enabled, setEnabled}}><div className="design-root" data-motion={enabled ? "on" : "off"}>{children}<div ref={light} className="ambient-cursor" aria-hidden="true" /></div></MotionContext.Provider>;
}

