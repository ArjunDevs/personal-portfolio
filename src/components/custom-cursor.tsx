import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import shotShare     from "../assets/projects/synclabs/Screenshot 2026-05-24 235317.png";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Only run the cursor on genuine mouse devices. Require BOTH hover and a fine
  // pointer: phones/tablets report `hover: none` (and a tap synthesizes a
  // mouse event, which would otherwise make the dot pop in where you tapped).
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );

  useEffect(() => {
    if (!enabled) return;

    gsap.set(dotRef.current, { xPercent: -50, yPercent: -50 });

    const move = (e: MouseEvent): void => {
      gsap.to(dotRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power3.out",
      });
    };

    const expand = (e: Event): void => {
      const target = e.target as HTMLElement;
      if (target.dataset.ctype === "nav") {
        gsap.to(dotRef.current, { scale: 5, duration: 0.3, ease: "power3.out" });
      }
      else if (target.dataset.ctype === "download") {
        if (labelRef.current) {
          labelRef.current.textContent = "DOWNLOAD"
        }
        dotRef.current?.classList.remove("mix-blend-difference");
        gsap.to(dotRef.current, {
          width: 120,
          height: 48,
          borderRadius: 12,
          duration: 0.3,
          ease: "power3.out",
          background: "#6666FF"
        });
        gsap.to(labelRef.current, { autoAlpha: 1, duration: 0.3, ease: "power3.out" });
      }
      else if (target.dataset.ctype === "email") {
        if (labelRef.current) {
          labelRef.current.textContent = "EMAIL ME"
        }
        dotRef.current?.classList.remove("mix-blend-difference");
        gsap.to(dotRef.current, {
          width: 120,
          height: 48,
          borderRadius: 12,
          duration: 0.3,
          ease: "power3.out",
          background: "#00FFFF",
        });
        gsap.to(labelRef.current, { autoAlpha: 1, duration: 0.3, ease: "power3.out", color: "#000" });
      }
      else if (target.dataset.ctype === "live") {
        gsap.to(dotRef.current, { scale: 5, duration: 0.3, ease: "power3.out" });
      }
      else if (target.dataset.ctype === "github") {
        gsap.to(dotRef.current, { scale: 5, duration: 0.3, ease: "power3.out" });
      }
      
    };

    const shrink = (): void => {
      dotRef.current?.classList.add("mix-blend-difference");
      gsap.to(dotRef.current, {
        scale: 1,
        width: 20,
        height: 20,
        borderRadius: 9999,
        duration: 0.3,
        ease: "power3.out",
        background: "#fff"
      });
      gsap.to(labelRef.current, { autoAlpha: 0, duration: 0.3, ease: "power3.out", color: "#fff" });
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", expand);
    window.addEventListener("mouseout", shrink);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", expand);
      window.removeEventListener("mouseout", shrink);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 w-5 h-5 rounded-full bg-white pointer-events-none -translate-x-1/2 -translate-y-1/2 z-9999 flex items-center justify-center overflow-hidden"
    >
      <span
        ref={labelRef}
        className="text-white text-sm font-semibold font-jetbrains whitespace-nowrap"
      />

      <img className="hidden" ref={imgRef} src={shotShare}/>
    </div>
  );
}