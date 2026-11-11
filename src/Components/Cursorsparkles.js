import { useEffect } from "react";

/* Tiny star trail that follows the mouse. Mount once in Homepage.
   Skipped on touch screens and when reduced motion is on. */
const COLORS = ["#ff4d5e", "#ffd23f", "#ffffff", "#ff8a7a"];

export default function CursorSparkles() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    if (reduce.matches || !fine.matches) return undefined;

    let last = 0;
    let n = 0;

    const onMove = (e) => {
      const now = performance.now();
      if (now - last < 70) return;
      last = now;

      const el = document.createElement("span");
      const size = 6 + Math.random() * 7;
      el.className = "cartoon-spark";
      el.style.left = `${e.clientX + (Math.random() - 0.5) * 12}px`;
      el.style.top = `${e.clientY + (Math.random() - 0.5) * 12}px`;
      el.style.setProperty("--s", `${size}px`);
      el.style.setProperty("--c", COLORS[n % COLORS.length]);
      n += 1;
      el.addEventListener("animationend", () => el.remove());
      document.body.appendChild(el);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
